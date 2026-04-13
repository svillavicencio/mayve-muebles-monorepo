import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type {
  ProductRepository,
  ProductFilter,
} from '../../domain/repositories/product.repository';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async getAllProducts(filter?: ProductFilter) {
    return this.productRepository.findProducts(filter);
  }

  async getProductBySlug(slug: string) {
    return this.productRepository.findProductBySlug(slug);
  }

  async getAllCategories() {
    return this.productRepository.findCategories();
  }
}
