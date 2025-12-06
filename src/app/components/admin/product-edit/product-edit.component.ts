// src/app/components/admin/product-edit/product-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { slugify } from 'src/app/functions/slug.util';
import {
  UpdateProductRequest,
  ProductService
} from 'src/app/services/product.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  saveError: string | null = null;

  selectedFile: File | null = null;
  uploadProgress = 0;
  imagePreviewUrl: string | null = null;

  // 🔥 ID SHOULD BE STRING, NOT NUMBER
  productId!: string;
  product: Product | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      slug: [{ value: '', disabled: true }],
      stock: [0, [Validators.min(0)]],
      imageKey: [''],
      description: ['']
    });

    this.form.get('name')!.valueChanges.subscribe(name => {
      const autoSlug = slugify(name || '');
      this.form.patchValue({ slug: autoSlug }, { emitEvent: false });
    });
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        // ❌ this.productId = +idParam;
        // ✅ keep it as string:
        this.productId = idParam;
        this.loadProduct();
      }
    });
  }

  loadProduct(): void {
    this.productService.getById(this.productId).subscribe({
      next: product => {
        this.product = product;
        this.form.patchValue({
          name: product.name,
          price: product.price,
          slug: product.slug || '',
          stock: product.stock ?? 0,
          imageKey: product.imageKey || '',
          description: product.description || ''
        });

        this.imagePreviewUrl = product.imageUrl || null;
      },
      error: err => {
        console.error(err);
        this.saveError = 'Failed to load product.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      this.imagePreviewUrl = this.product?.imageUrl || null;
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
      this.uploadAndUpdate();
    } else {
      this.updateProduct();
    }
  }

  private uploadAndUpdate(): void {
    if (!this.selectedFile) {
      this.updateProduct();
      return;
    }

    this.uploadProgress = 0;

    this.uploadService.uploadImage(this.selectedFile).subscribe({
      next: res => {
        this.form.patchValue({ imageKey: res.key });
        this.updateProduct();
      },
      error: err => {
        console.error(err);
        this.saveError = 'Image upload failed.';
        this.saving = false;
      }
    });
  }

  private updateProduct(): void {
    // includes disabled fields like slug
    const value = this.form.getRawValue();

    const payload: UpdateProductRequest = {
      title: value.name,
      priceCents: Math.round(value.price * 100),
      slug: value.slug || null,
      currency: 'USD',
      imageKey: value.imageKey || (this.product as any)?.imageKey || null,
      stock: value.stock ?? 0,
      description: value.description || null
    };

    this.productService.update(this.productId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/products']);
      },
      error: err => {
        console.error(err);
        this.saveError = 'Failed to update product.';
        this.saving = false;
      }
    });
  }
}
