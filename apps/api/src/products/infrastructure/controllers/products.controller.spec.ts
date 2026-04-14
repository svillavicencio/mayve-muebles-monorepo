import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ProductsController } from './products.controller';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { STORAGE_SERVICE } from '../../../common/storage/storage.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let getProductsUseCase: any;
  let createProductUseCase: any;
  let updateProductUseCase: any;
  let deleteProductUseCase: any;
  let storageService: any;

  beforeEach(async () => {
    getProductsUseCase = {
      getAllProducts: jest.fn(),
      getProductBySlug: jest.fn(),
      getAllCategories: jest.fn(),
    };
    createProductUseCase = {
      execute: jest.fn(),
    };
    updateProductUseCase = {
      execute: jest.fn(),
    };
    deleteProductUseCase = {
      execute: jest.fn(),
    };
    storageService = {
      saveFile: jest.fn().mockResolvedValue('/uploads/test.jpg'),
      deleteFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: GetProductsUseCase, useValue: getProductsUseCase },
        { provide: CreateProductUseCase, useValue: createProductUseCase },
        { provide: UpdateProductUseCase, useValue: updateProductUseCase },
        { provide: DeleteProductUseCase, useValue: deleteProductUseCase },
        { provide: STORAGE_SERVICE, useValue: storageService },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should call getAllProducts without filter when no query param', async () => {
      await controller.getProducts();
      expect(getProductsUseCase.getAllProducts).toHaveBeenCalledWith(undefined);
    });

    it('should call getAllProducts with featured filter when featured=true', async () => {
      await controller.getProducts('true');
      expect(getProductsUseCase.getAllProducts).toHaveBeenCalledWith({
        featured: true,
      });
    });
  });

  describe('createProduct', () => {
    it('should upload files and call CreateProductUseCase.execute', async () => {
      const dto = {
        name: 'P1',
        price: '100',
        listPrice: '120',
        cashDiscountPrice: '90',
        leadTime: '7',
        isFeatured: 'true',
        inStock: 'true',
        isCustomizable: 'false',
        requiresAssembly: 'true',
      };
      const mockFile = { buffer: Buffer.from('test') } as Express.Multer.File;
      const files = [mockFile];

      await controller.createProduct(dto as any, files);

      expect(storageService.saveFile).toHaveBeenCalledWith(mockFile);
      expect(createProductUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'P1',
          price: 100,
          images: ['/uploads/test.jpg'],
          isFeatured: true,
        }),
      );
    });
  });

  describe('Route ordering — HTTP level', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        controllers: [ProductsController],
        providers: [
          { provide: GetProductsUseCase, useValue: getProductsUseCase },
          { provide: CreateProductUseCase, useValue: createProductUseCase },
          { provide: UpdateProductUseCase, useValue: updateProductUseCase },
          { provide: DeleteProductUseCase, useValue: deleteProductUseCase },
          { provide: STORAGE_SERVICE, useValue: storageService },
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterEach(async () => {
      await app.close();
    });

    it('GET /products/categories resolves to the categories handler (returns array, not a product)', async () => {
      getProductsUseCase.getAllCategories.mockResolvedValue([
        { id: '1', name: 'Cat' },
      ]);

      const response = await request(app.getHttpServer()).get(
        '/products/categories',
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /products/:slug still resolves to the product handler after categories fix', async () => {
      getProductsUseCase.getProductBySlug.mockResolvedValue({
        id: '1',
        name: 'Product',
      });

      const response = await request(app.getHttpServer()).get('/products/mesa');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: '1', name: 'Product' });
    });
  });
});
