import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, data: Partial<Omit<Product, 'id'>>): Promise<Product> {
    const product = await this.productRepository.update(id, data);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
