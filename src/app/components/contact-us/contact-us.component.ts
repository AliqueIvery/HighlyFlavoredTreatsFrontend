import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ContactUsService } from 'src/app/services/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;

  sending = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private contactSvc: ContactUsService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;
    this.success = null;

    if (this.contactForm.invalid) return;

    const payload = {
      name: (this.contactForm.value.name || '').trim(),
      email: (this.contactForm.value.email || '').trim(),
      phone: (this.contactForm.value.phone || '').trim() || null,
      message: (this.contactForm.value.message || '').trim(),
    };

    this.sending = true;

    this.contactSvc.sendMessage(payload)
      .pipe(finalize(() => (this.sending = false)))
      .subscribe({
        next: () => {
          this.success = 'Thank you for contacting us! We’ll get back to you soon. 💌';
          this.contactForm.reset();
          this.submitted = false;
        },
        error: (e) => {
          console.error(e);
          this.error = 'Failed to send message. Please try again in a moment.';
        }
      });
  }
}
