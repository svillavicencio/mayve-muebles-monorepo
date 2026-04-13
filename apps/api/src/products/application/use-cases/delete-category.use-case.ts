import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    return this.productRepository.deleteCategory(id);
  }
}
