// src/app/components/admin/product-edit/product-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { slugify } from 'src/app/functions/slug.util';
import { UpdateProductRequest, ProductService } from 'src/app/services/product.service';
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

  productId!: string;
  product: Product | null = null;

  // ✅ keep in sync with whatever you allow (S3 presign can handle larger; UI guard helps)
  private readonly MAX_IMAGE_MB = 10;

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
          // ⚠️ keep your existing mapping
          name: (product as any).name ?? (product as any).title ?? '',
          price: (product as any).price ?? ((product as any).priceCents ?? 0) / 100,
          slug: (product as any).slug || '',
          stock: (product as any).stock ?? 0,
          imageKey: (product as any).imageKey || '',
          description: (product as any).description || ''
        });

        this.imagePreviewUrl = (product as any).imageUrl || null;
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
      this.imagePreviewUrl = (this.product as any)?.imageUrl || null;
      return;
    }

    const file = input.files[0];

    // ✅ File size guard (prevents 413 / confusing failures)
    const mb = file.size / (1024 * 1024);
    if (mb > this.MAX_IMAGE_MB) {
      this.selectedFile = null;
      this.imagePreviewUrl = (this.product as any)?.imageUrl || null;
      this.saveError = `Image too large. Max ${this.MAX_IMAGE_MB}MB. Selected: ${mb.toFixed(2)}MB.`;
      input.value = '';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.imagePreviewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  // ✅ CHANGED: now async
  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.saveError = null;

    try {
      // ✅ If a new image is selected, upload via presigned flow first
      if (this.selectedFile) {
        this.uploadProgress = 0;

        const res = await this.uploadService.uploadImagePresigned(this.selectedFile);

        // res should include { key }
        this.form.patchValue({ imageKey: res.key });

        // optional UI progress
        this.uploadProgress = 100;
      }

      // then update product
      this.updateProduct();
    } catch (err) {
      console.error(err);
      this.saveError = 'Image upload failed.';
      this.saving = false;
    }
  }

  private updateProduct(): void {
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