import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  TenantEmailSettings,
  TenantEmailSettingsService
} from 'src/app/services/tenant-email-settings.service';

type UiDnsRecord = { type: string; name: string; value: string };

@Component({
  selector: 'app-tenant-email-settings',
  templateUrl: './tenant-email-settings.component.html',
  styleUrls: ['./tenant-email-settings.component.css']
})
export class TenantEmailSettingsComponent implements OnInit {
  loading = false;
  saving = false;
  verifying = false;
  error: string | null = null;

  // IMPORTANT: your HTML expects settings.dnsRecords to exist
  settings: (TenantEmailSettings & { dnsRecords: UiDnsRecord[] }) | null = null;

  form = this.fb.group({
    fromName: ['Highly Flavored Treats'],
    fromEmail: ['', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder, private svc: TenantEmailSettingsService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    this.svc.get().subscribe({
      next: s => {
        // Ensure settings has dnsRecords always (so .length never crashes)
        this.settings = this.withDnsRecords(s, []);

        this.form.patchValue({
          fromName: (s as any).fromName ?? '',
          fromEmail: (s as any).fromEmail ?? ''
        });

        // Load DNS records separately and attach to settings
        this.refreshDnsRecords();

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;

        // If tenant hasn't set it up yet, backend can return 404.
        this.error = 'No email settings yet. Enter a From Email to begin verification.';
        this.settings = null;
      }
    });
  }

  save() {
    this.error = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    this.svc.save({
      fromName: this.form.value.fromName || null,
      fromEmail: this.form.value.fromEmail!
    }).subscribe({
      next: s => {
        // Keep UI stable; dnsRecords exists even before generate returns
        this.settings = this.withDnsRecords(s, this.settings?.dnsRecords ?? []);

        // Your button says "Save & Generate DNS Records" — do it
        this.svc.generateDns().subscribe({
          next: records => {
            const ui = this.mapDns(records);
            this.settings = this.withDnsRecords(this.settings!, ui);
            this.saving = false;
          },
          error: err => {
            console.error(err);
            this.error = 'Saved, but failed to generate DNS records.';
            this.saving = false;

            // Still refresh DNS list in case backend generated some
            this.refreshDnsRecords();
          }
        });
      },
      error: err => {
        console.error(err);
        this.error = 'Failed to save email settings.';
        this.saving = false;
      }
    });
  }

  verify() {
    this.error = null;
    this.verifying = true;

    this.svc.verify().subscribe({
      next: res => {
        // Some verify endpoints return settings; others return {domainVerified, dkimVerified, status}
        // We only need refreshed status + DNS list.
        this.refreshSettingsAndDns();
        this.verifying = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Verify failed. Double-check DNS records and try again in a few minutes.';
        this.verifying = false;
      }
    });
  }

  // ---------- helpers ----------

  private refreshSettingsAndDns() {
    this.svc.get().subscribe({
      next: s => {
        this.settings = this.withDnsRecords(s, this.settings?.dnsRecords ?? []);
        this.refreshDnsRecords();
      },
      error: err => console.error(err)
    });
  }

  private refreshDnsRecords() {
    // If settings doesn't exist yet, nothing to attach to
    if (!this.settings) return;

    this.svc.getDns().subscribe({
      next: records => {
        const ui = this.mapDns(records);
        this.settings = this.withDnsRecords(this.settings!, ui);
      },
      error: err => {
        console.error(err);
        // keep dnsRecords as empty array instead of undefined
        this.settings = this.withDnsRecords(this.settings!, []);
      }
    });
  }

  private withDnsRecords(
    s: TenantEmailSettings | (TenantEmailSettings & { dnsRecords?: UiDnsRecord[] }),
    dnsRecords: UiDnsRecord[]
  ): (TenantEmailSettings & { dnsRecords: UiDnsRecord[] }) {
    return { ...(s as any), dnsRecords: Array.isArray(dnsRecords) ? dnsRecords : [] };
  }

  /**
   * Maps backend DNS record shape to the UI shape your HTML expects:
   * UI uses: r.type, r.name, r.value
   * Backend likely returns: recordType, host, value (or type/name/value)
   */
  private mapDns(records: any[] | null | undefined): UiDnsRecord[] {
    const arr = records ?? [];
    return arr.map((r: any) => ({
      type: r.recordType || r.type || '',
      name: r.host || r.name || '',
      value: r.value || ''
    }));
  }

  statusLabel(status: string) {
    const s = (status || '').toLowerCase();
    if (s === 'verified') return 'Verified ✅';
    if (s === 'pending') return 'Pending ⏳';
    return 'Failed ⚠️';
  }
}
