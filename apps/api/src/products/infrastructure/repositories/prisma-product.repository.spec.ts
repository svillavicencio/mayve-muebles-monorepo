import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@mayve/database';
import { PrismaProductRepository } from './prisma-product.repository';

describe('PrismaProductRepository', () => {
  let repository: PrismaProductRepository;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up after all tests to leave a clean DB
    await prisma.image.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    jest.setTimeout(30000);
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaProductRepository],
    }).compile();

    repository = module.get<PrismaProductRepository>(PrismaProductRepository);

    // Clean up before each test
    await prisma.image.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  describe('isSlugAvailable', () => {
    it('should return true if slug does not exist', async () => {
      const result = await repository.isSlugAvailable('non-existent');
      expect(result).toBe(true);
    });

    it('should return false if slug exists', async () => {
      const category = await prisma.category.create({
        data: { name: 'Cat', slug: 'cat' },
      });

      await prisma.product.create({
        data: {
          name: 'Product',
          slug: 'product',
          description: 'Desc',
          price: 100,
          listPrice: 100,
          cashDiscountPrice: 100,
          categoryId: category.id,
        },
      });

      const result = await repository.isSlugAvailable('product');
      expect(result).toBe(false);
    });
  });

  describe('findMaxSlugSuffix', () => {
    it('should return -1 if no slugs with same base exist', async () => {
      const result = await repository.findMaxSlugSuffix('base');
      expect(result).toBe(-1);
    });

    it('should return the max suffix found', async () => {
      const category = await prisma.category.create({
        data: { name: 'Cat', slug: 'cat' },
      });

      await prisma.product.createMany({
        data: [
          {
            name: 'P1',
            slug: 'mesa',
            description: 'D',
            price: 100,
            listPrice: 100,
            cashDiscountPrice: 100,
            categoryId: category.id,
          },
          {
            name: 'P2',
            slug: 'mesa-1',
            description: 'D',
            price: 100,
            listPrice: 100,
            cashDiscountPrice: 100,
            categoryId: category.id,
          },
          {
            name: 'P3',
            slug: 'mesa-5',
            description: 'D',
            price: 100,
            listPrice: 100,
            cashDiscountPrice: 100,
            categoryId: category.id,
          },
          {
            name: 'P4',
            slug: 'mesa-other',
            description: 'D',
            price: 100,
            listPrice: 100,
            cashDiscountPrice: 100,
            categoryId: category.id,
          },
        ],
      });

      const result = await repository.findMaxSlugSuffix('mesa');
      expect(result).toBe(5);
    });
  });

  describe('findProducts', () => {
    it('should return all products when no filter is provided', async () => {
      const category = await prisma.category.create({
        data: { name: 'Cat', slug: 'cat' },
      });
      await prisma.product.createMany({
        data: [
          {
            name: 'P1',
            slug: 'p1',
            description: 'D',
            price: 100,
            listPrice: 100,
            cashDiscountPrice: 100,
            categoryId: category.id,
            isFeatured: false,
          },
          {
            name: 'P2',
            slug: 'p2',
            description: 'D',
            price: 200,
            listPrice: 200,
            cashDiscountPrice: 200,
            categoryId: category.id,
            isFeatured: true,
          },
        ],
      });

      const result = await repository.findProducts();
      expect(result).toHaveLength(2);
    });

    it('should return empty array when featured=true but no featured products exist', async () => {
      const category = await prisma.category.create({
        data: { name: 'Cat3', slug: 'cat3' },
      });
      await prisma.product.create({
        data: {
          name: 'Normal',
          slug: 'normal-only',
          description: 'D',
          price: 100,
          listPrice: 100,
          cashDiscountPrice: 100,
          categoryId: category.id,
          isFeatured: false,
        },
      });

      const result = await repository.findProducts({ featured: true });
      expect(result).toHaveLength(0);
    });

    it('should return only featured products when filter featured=true', async () => {
      const category = await prisma.category.create({
        data: { name: 'Cat2', slug: 'cat2' },
      });
      await prisma.product.createMany({
        data: [
          {
            name: 'Normal',
            slug: 'normal',
            description: 'D',
            price: 100,
            listPrice: 100,
            cashDiscountPrice: 100,
            categoryId: category.id,
            isFeatured: false,
          },
          {
            name: 'Featured',
            slug: 'featured',
            description: 'D',
            price: 200,
            listPrice: 200,
            cashDiscountPrice: 200,
            categoryId: category.id,
            isFeatured: true,
          },
        ],
      });

      const result = await repository.findProducts({ featured: true });
      expect(result).toHaveLength(1);
      expect(result[0].isFeatured).toBe(true);
      expect(result[0].name).toBe('Featured');
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const category = await prisma.category.create({
        data: { name: 'Comedores', slug: 'comedores' },
      });

      const productData = {
        name: 'Mesa de Roble',
        slug: 'mesa-de-roble',
        description: 'Una hermosa mesa de roble.',
        price: 1500,
        categoryId: category.id,
        leadTime: 15,
        isCustomizable: true,
        listPrice: 1800,
        cashDiscountPrice: 1400,
        inStock: true,
        requiresAssembly: false,
        materials: 'Roble macizo',
        dimensions: '200x100x75cm',
        structure: 'Madera',
        finish: 'Barniz natural',
        fabric: '',
        shippingWeight: 50,
        images: [],
      };

      const product = await repository.create(productData);

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe(productData.name);
      expect(product.slug).toBe(productData.slug);

      const dbProduct = await prisma.product.findUnique({
        where: { id: product.id },
      });
      expect(dbProduct).toBeDefined();
      expect(dbProduct?.name).toBe(productData.name);
    });
  });
});
