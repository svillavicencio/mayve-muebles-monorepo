import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@mayve/database';
import { PrismaProductRepository } from './prisma-product.repository';
import { PrismaModule } from '../../../common/prisma/prisma.module';

describe('PrismaProductRepository', () => {
  let repository: PrismaProductRepository;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.image.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    jest.setTimeout(30000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaProductRepository],
    }).compile();

    repository = module.get<PrismaProductRepository>(PrismaProductRepository);

    await prisma.image.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  const createCategory = async () => {
    return await prisma.category.create({
      data: { name: 'Cat', slug: 'cat' },
    });
  };

  const createProductWithImage = async (data: any) => {
    return await prisma.product.create({
      data: {
        ...data,
        images: {
          create: [{ url: 'image1.jpg', isMain: true }],
        },
      },
    });
  };

  describe('isSlugAvailable', () => {
    it('should return true if slug does not exist', async () => {
      const result = await repository.isSlugAvailable('non-existent');
      expect(result).toBe(true);
    });

    it('should return false if slug exists', async () => {
      const category = await createCategory();
      await createProductWithImage({
        name: 'Product',
        slug: 'product',
        description: 'Desc',
        price: 100,
        listPrice: 100,
        cashDiscountPrice: 100,
        categoryId: category.id,
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
      const category = await createCategory();

      const productsData = [
        { name: 'P1', slug: 'mesa' },
        { name: 'P2', slug: 'mesa-1' },
        { name: 'P3', slug: 'mesa-5' },
        { name: 'P4', slug: 'mesa-other' },
      ];

      for (const p of productsData) {
        await createProductWithImage({
          ...p,
          description: 'D',
          price: 100,
          listPrice: 100,
          cashDiscountPrice: 100,
          categoryId: category.id,
        });
      }

      const result = await repository.findMaxSlugSuffix('mesa');
      expect(result).toBe(5);
    });
  });

  describe('findProducts', () => {
    it('should return all products when no filter is provided', async () => {
      const category = await createCategory();
      await createProductWithImage({
        name: 'P1',
        slug: 'p1',
        description: 'D',
        price: 100,
        listPrice: 100,
        cashDiscountPrice: 100,
        categoryId: category.id,
        isFeatured: false,
      });
      await createProductWithImage({
        name: 'P2',
        slug: 'p2',
        description: 'D',
        price: 200,
        listPrice: 200,
        cashDiscountPrice: 200,
        categoryId: category.id,
        isFeatured: true,
      });

      const result = await repository.findProducts();
      expect(result).toHaveLength(2);
    });

    it('should return empty array when featured=true but no featured products exist', async () => {
      const category = await createCategory();
      await createProductWithImage({
        name: 'Normal',
        slug: 'normal-only',
        description: 'D',
        price: 100,
        listPrice: 100,
        cashDiscountPrice: 100,
        categoryId: category.id,
        isFeatured: false,
      });

      const result = await repository.findProducts({ featured: true });
      expect(result).toHaveLength(0);
    });

    it('should return only featured products when filter featured=true', async () => {
      const category = await createCategory();
      await createProductWithImage({
        name: 'Normal',
        slug: 'normal',
        description: 'D',
        price: 100,
        listPrice: 100,
        cashDiscountPrice: 100,
        categoryId: category.id,
        isFeatured: false,
      });
      await createProductWithImage({
        name: 'Featured',
        slug: 'featured',
        description: 'D',
        price: 200,
        listPrice: 200,
        cashDiscountPrice: 200,
        categoryId: category.id,
        isFeatured: true,
      });

      const result = await repository.findProducts({ featured: true });
      expect(result).toHaveLength(1);
      expect(result[0].isFeatured).toBe(true);
      expect(result[0].name).toBe('Featured');
    });
  });

  describe('create', () => {
    it('should create a new product with images', async () => {
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
        images: ['image1.jpg'],
      };

      const product = await repository.create(productData);

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe(productData.name);
      expect(product.slug).toBe(productData.slug);
      expect(product.images).toContain('image1.jpg');

      const dbProduct = await prisma.product.findUnique({
        where: { id: product.id },
        include: { images: true },
      });
      expect(dbProduct).toBeDefined();
      expect(dbProduct?.name).toBe(productData.name);
      expect(dbProduct?.images).toHaveLength(1);
      expect(dbProduct?.images[0].url).toBe('image1.jpg');
    });
  });
});
