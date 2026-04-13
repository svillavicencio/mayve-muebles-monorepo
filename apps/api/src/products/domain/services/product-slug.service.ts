import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../repositories/product.repository';
import type { ProductRepository } from '../repositories/product.repository';
import { SlugGenerator } from './slug-generator';

@Injectable()
export class ProductSlugService {
  constructor(
    private readonly slugGenerator: SlugGenerator,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = this.slugGenerator.generate(name);
    const isAvailable = await this.productRepository.isSlugAvailable(baseSlug);

    if (isAvailable) {
      return baseSlug;
    }

    const maxSuffix = await this.productRepository.findMaxSlugSuffix(baseSlug);
    return `${baseSlug}-${maxSuffix + 1}`;
  }
}
