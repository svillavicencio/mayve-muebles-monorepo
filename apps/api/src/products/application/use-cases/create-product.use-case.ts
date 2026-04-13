import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductSlugService } from '../../domain/services/product-slug.service';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    private readonly slugService: ProductSlugService,
  ) {}

  async execute(
    data: Omit<Product, 'id' | 'slug' | 'images'>,
  ): Promise<Product> {
    const slug = await this.slugService.generateUniqueSlug(data.name);
    return this.productRepository.create({
      ...data,
      slug,
      images: [],
    });
  }
}
