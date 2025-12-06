// src/app/utils/product.mapper.ts

import { environment } from 'src/environments/environment';
import { ApiProduct } from '../common/dto/api-product';
import { Product as UiProduct } from '../common/product';

const S3_BASE_URL = 'https://your-s3-url.com/'; // replace with real bucket URL or CloudFront domain

export function mapApiProductToUi(api: ApiProduct): UiProduct {
  return {
    id: api.id,
    name: api.title,
    description: api.description || '', // use slug for now, until backend adds a description
    price: api.priceCents / 100, // convert cents to dollars
    imageUrl: api.imageKey ? `${environment.S3_BASE_URL}${api.imageKey}` : ''
  };
}
