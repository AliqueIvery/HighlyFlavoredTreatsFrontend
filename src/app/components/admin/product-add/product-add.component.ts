// src/app/components/admin/product-add/product-add.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CreateProductRequest,
  ProductService
} from 'src/app/services/product.service';
import { UploadService } from 'src/app/services/upload.service';
import { slugify } from 'src/app/functions/slug.util';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  saveError: string | null = null;

  selectedFile: File | null = null;
  uploadProgress = 0;
  imagePreviewUrl: string | null = null;
  readonly MAX_IMAGE_MB = 10;
  readonly MAX_IMAGE_BYTES = this.MAX_IMAGE_MB * 1024 * 1024;
  readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private uploadService: UploadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      // slug is auto-generated + disabled
      slug: [{ value: '', disabled: true }],
      stock: [0, [Validators.min(0)]],
      imageKey: [''],
      description: ['']
    });

    // auto-generate slug from name
    this.form.get('name')!.valueChanges.subscribe(name => {
      const autoSlug = slugify(name || '');
      this.form.patchValue({ slug: autoSlug }, { emitEvent: false });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      return;
    }

    const file = input.files[0];

    // ✅ size validation
    if (file.size > this.MAX_IMAGE_BYTES) {
      this.saveError = `Image is too large. Max size is ${(this.MAX_IMAGE_BYTES / (1024*1024)).toFixed(0)}MB.`;
      input.value = '';
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      return;
    }

    this.saveError = null;
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.imagePreviewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.saveError) return;

    this.saving = true;
    this.saveError = null;

    if (this.selectedFile) {
      await this.uploadAndCreate();
    } else {
      this.createProduct();
    }
  }

  private async uploadAndCreate(): Promise<void> {
    if (!this.selectedFile) {
      this.createProduct();
      return;
    }

    try {
      const res = await this.uploadService.uploadImagePresigned(this.selectedFile);
      this.form.patchValue({ imageKey: res.key });
      this.createProduct();
    } catch (err) {
      console.error(err);
      this.saveError = 'Image upload failed.';
      this.saving = false;
    }
  }

  private createProduct(): void {
    // includes disabled fields like slug
    const value = this.form.getRawValue();

    const payload: CreateProductRequest = {
      title: value.name,
      priceCents: Math.round(value.price * 100),
      slug: value.slug || null,
      currency: 'USD',
      imageKey: value.imageKey || null,
      stock: value.stock ?? 0,
      description: value.description || null
    };

    this.productService.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/products']);
      },
      error: err => {
        console.error(err);
        this.saveError = 'Failed to save product.';
        this.saving = false;
      }
    });
  }
}
