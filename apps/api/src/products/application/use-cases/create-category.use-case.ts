import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { Category } from '../../domain/entities/product.entity';
import { SlugGenerator } from '../../domain/services/slug-generator';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    private readonly slugGenerator: SlugGenerator,
  ) {}

  async execute(name: string): Promise<Category> {
    const slug = this.slugGenerator.generate(name);
    return this.productRepository.createCategory(name, slug);
  }
}
