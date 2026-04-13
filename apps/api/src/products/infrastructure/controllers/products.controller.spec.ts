import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest') as (typeof import('supertest'))['default'];
import { ProductsController } from './products.controller';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { CreateProductDto } from './dtos/create-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let createUseCase: CreateProductUseCase;

  const mockProduct = {
    id: '1',
    name: 'Mesa de Roble',
    slug: 'mesa-de-roble',
    description: 'Una hermosa mesa de roble.',
    price: 1500,
    categoryId: 'cat1',
    images: [],
  };

  const mockCreateProductUseCase = {
    execute: jest.fn().mockResolvedValue(mockProduct),
  };

  const mockUpdateProductUseCase = {
    execute: jest.fn().mockResolvedValue(mockProduct),
  };

  const mockDeleteProductUseCase = {
    execute: jest.fn().mockResolvedValue(true),
  };

  const mockGetProductsUseCase = {
    getAllProducts: jest.fn(),
    getProductBySlug: jest.fn(),
    getAllCategories: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: GetProductsUseCase,
          useValue: mockGetProductsUseCase,
        },
        {
          provide: CreateProductUseCase,
          useValue: mockCreateProductUseCase,
        },
        {
          provide: UpdateProductUseCase,
          useValue: mockUpdateProductUseCase,
        },
        {
          provide: DeleteProductUseCase,
          useValue: mockDeleteProductUseCase,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    createUseCase = module.get<CreateProductUseCase>(CreateProductUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should call getAllProducts without filter when no query param', async () => {
      mockGetProductsUseCase.getAllProducts.mockResolvedValue([]);
      await controller.getProducts(undefined);
      expect(mockGetProductsUseCase.getAllProducts).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should call getAllProducts with featured filter when featured=true', async () => {
      mockGetProductsUseCase.getAllProducts.mockResolvedValue([]);
      await controller.getProducts('true');
      expect(mockGetProductsUseCase.getAllProducts).toHaveBeenCalledWith({
        featured: true,
      });
    });
  });

  describe('getCategories', () => {
    it('should call getAllCategories and return the result', async () => {
      const mockCategories = [{ id: 'cat-1', name: 'Salas', slug: 'salas' }];
      mockGetProductsUseCase.getAllCategories.mockResolvedValue(mockCategories);
      const result = await controller.getCategories();
      expect(result).toEqual(mockCategories);
      expect(mockGetProductsUseCase.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('Route ordering — HTTP level', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        controllers: [ProductsController],
        providers: [
          { provide: GetProductsUseCase, useValue: mockGetProductsUseCase },
          { provide: CreateProductUseCase, useValue: mockCreateProductUseCase },
          { provide: UpdateProductUseCase, useValue: mockUpdateProductUseCase },
          { provide: DeleteProductUseCase, useValue: mockDeleteProductUseCase },
        ],
      }).compile();
      app = module.createNestApplication();
      await app.init();
      mockGetProductsUseCase.getAllCategories.mockResolvedValue([
        { id: 'cat-1', name: 'Salas', slug: 'salas' },
      ]);
      mockGetProductsUseCase.getProductBySlug.mockResolvedValue(mockProduct);
    });

    afterEach(async () => {
      await app.close();
    });

    it('GET /products/categories resolves to the categories handler (returns array, not a product)', async () => {
      return request(app.getHttpServer())
        .get('/products/categories')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0].id).toBe('cat-1');
        });
    });

    it('GET /products/:slug still resolves to the product handler after categories fix', async () => {
      return request(app.getHttpServer())
        .get('/products/mesa-de-roble')
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Mesa de Roble');
        });
    });
  });

  describe('createProduct', () => {
    it('should call CreateProductUseCase.execute and return the created product', async () => {
      const dto: CreateProductDto = {
        name: 'Mesa de Roble',
        description: 'Una hermosa mesa de roble.',
        price: 1500,
        categoryId: 'cat1',
        leadTime: 15,
        isCustomizable: true,
        listPrice: 1800,
        cashDiscountPrice: 1400,
        inStock: true,
        requiresAssembly: false,
        isFeatured: false,
        materials: 'Roble macizo',
        dimensions: '200x100x75cm',
        structure: 'Madera',
        finish: 'Barniz natural',
        fabric: '',
        shippingWeight: 50,
      };

      const result = await controller.createProduct(dto);

      expect(result).toEqual(mockProduct);
      expect(createUseCase.execute).toHaveBeenCalledWith({ ...dto, isFeatured: false });
    });
  });
});
