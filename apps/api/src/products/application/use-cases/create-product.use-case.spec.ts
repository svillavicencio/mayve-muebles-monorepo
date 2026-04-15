import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductUseCase } from './create-product.use-case';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import { ProductSlugService } from '../../domain/services/product-slug.service';
import { Product } from '../../domain/entities/product.entity';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let repository: any;
  let slugService: any;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
    };
    slugService = {
      generateUniqueSlug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: repository,
        },
        {
          provide: ProductSlugService,
          useValue: slugService,
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
  });

  it('should generate a slug and create a product with images', async () => {
    const productData = {
      name: 'Modern Chair',
      description: 'A very modern chair',
      price: 150,
      categoryId: 'cat1',
      leadTime: 5,
      isCustomizable: true,
      listPrice: 160,
      cashDiscountPrice: 140,
      inStock: true,
      requiresAssembly: false,
      isFeatured: false,
      images: ['image1.jpg'],
    };
    const mockSlug = 'modern-chair';
    const mockProduct = new Product(
      '1',
      productData.name,
      mockSlug,
      productData.description,
      productData.price,
      productData.categoryId,
      productData.leadTime,
      productData.isCustomizable,
      productData.listPrice,
      productData.cashDiscountPrice,
      productData.inStock,
      productData.requiresAssembly,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      productData.images,
    );

    slugService.generateUniqueSlug.mockResolvedValue(mockSlug);
    repository.create.mockResolvedValue(mockProduct);

    const result = await useCase.execute(productData);

    expect(result).toEqual(mockProduct);
    expect(slugService.generateUniqueSlug).toHaveBeenCalledWith(
      productData.name,
    );
    expect(repository.create).toHaveBeenCalledWith({
      ...productData,
      slug: mockSlug,
    });
  });
});
