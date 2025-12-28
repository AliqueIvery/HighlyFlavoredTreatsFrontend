import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TenantStripeSettings, TenantStripeSettingsService } from 'src/app/services/tenant-stripe-settings.service';

@Component({
  selector: 'app-payments-settings',
  templateUrl: './payments-settings.component.html',
})
export class PaymentsSettingsComponent implements OnInit {
  loading = true;
  saving = false;
  error: string | null = null;

  settings: TenantStripeSettings | null = null;

  form = this.fb.group({
    stripeAccountId: ['', [Validators.required, Validators.pattern(/^acct_.+/)]],
  });

  constructor(private fb: FormBuilder, private api: TenantStripeSettingsService) {}

  ngOnInit(): void {
    console.log('[PaymentsSettings] ngOnInit fired'); // ✅ confirm this runs
    this.refresh();
  }

  refresh(): void {
    console.log('[PaymentsSettings] refresh() called'); // ✅ confirm this runs
    this.loading = true;
    this.error = null;

    this.api.get()
      .pipe(finalize(() => (this.loading = false))) // ✅ ALWAYS turns loading off
      .subscribe({
        next: (s) => {
          console.log('[PaymentsSettings] GET success', s);
          this.settings = s;

          this.form.patchValue({
            stripeAccountId: s?.stripeAccountId ?? ''
          });
        },
        error: (e) => {
          console.error('[PaymentsSettings] GET error', e);
          this.error = e?.error || 'Failed to load Stripe settings.';
        }
      });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const acct = (this.form.value.stripeAccountId || '').trim();

    this.saving = true;
    this.error = null;

    this.api.saveAccountId(acct)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (s) => {
          this.settings = s;
        },
        error: (e) => {
          console.error(e);
          this.error = e?.error || 'Failed to save Stripe Account ID.';
        }
      });
  }

  get readyToAcceptPayments(): boolean {
    const s = this.settings;
    if (!s) return false;
    return !!(s.detailsSubmitted && s.chargesEnabled);
  }
}
