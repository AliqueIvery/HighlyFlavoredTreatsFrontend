// src/app/components/admin/product-add/product-add.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateProductRequest, ProductService } from 'src/app/services/product.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent {
  form: FormGroup;
  saving = false;
  saveError: string | null = null;

  selectedFile: File | null = null;
  uploadProgress = 0;
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private uploadService: UploadService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      slug: [''],
      stock: [0, [Validators.min(0)]],
      imageKey: [''],
      description: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      return;
    }

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.saveError = null;

    if (this.selectedFile) {
      this.uploadAndCreate();
    } else {
      this.createProduct();
    }
  }

  private uploadAndCreate(): void {
    if (!this.selectedFile) {
      this.createProduct();
      return;
    }

    this.uploadProgress = 0;

    this.uploadService.uploadImage(this.selectedFile).subscribe({
      next: res => {
        this.form.patchValue({ imageKey: res.key });
        this.createProduct();
      },
      error: err => {
        console.error(err);
        this.saveError = 'Image upload failed.';
        this.saving = false;
      }
    });
  }

  private createProduct(): void {
    const value = this.form.value;

    const payload: CreateProductRequest = {
      title: value.name,
      priceCents: Math.round(value.price * 100),
      slug: value.slug || null,
      currency: 'USD',
      imageKey: value.imageKey || null,
      stock: value.stock ?? 0
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
