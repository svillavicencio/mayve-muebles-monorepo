import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsUseCase } from './get-products.use-case';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;
  let repository: any;

  beforeEach(async () => {
    repository = {
      findProducts: jest.fn(),
      findProductBySlug: jest.fn(),
      findCategories: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    useCase = module.get<GetProductsUseCase>(GetProductsUseCase);
  });

  it('should return all products when no filter is given', async () => {
    const mockProducts = [
      new Product(
        '1',
        'Chair',
        'chair',
        'desc',
        100,
        'cat1',
        0,
        false,
        0,
        0,
        true,
        false,
      ),
    ];
    repository.findProducts.mockResolvedValue(mockProducts);

    const result = await useCase.getAllProducts();
    expect(result).toEqual(mockProducts);
    expect(repository.findProducts).toHaveBeenCalledWith(undefined);
  });

  it('should forward featured filter to repository', async () => {
    const mockFeaturedProducts = [
      new Product(
        '2',
        'Featured Chair',
        'featured-chair',
        'desc',
        200,
        'cat1',
        0,
        false,
        0,
        0,
        true,
        false,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [],
        true,
      ),
    ];
    repository.findProducts.mockResolvedValue(mockFeaturedProducts);

    const result = await useCase.getAllProducts({ featured: true });
    expect(result).toEqual(mockFeaturedProducts);
    expect(repository.findProducts).toHaveBeenCalledWith({ featured: true });
  });

  it('should return product by slug', async () => {
    const mockProduct = new Product(
      '1',
      'Chair',
      'chair',
      'desc',
      100,
      'cat1',
      0,
      false,
      0,
      0,
      true,
      false,
    );
    repository.findProductBySlug.mockResolvedValue(mockProduct);

    const result = await useCase.getProductBySlug('chair');
    expect(result).toEqual(mockProduct);
    expect(repository.findProductBySlug).toHaveBeenCalledWith('chair');
  });
});
