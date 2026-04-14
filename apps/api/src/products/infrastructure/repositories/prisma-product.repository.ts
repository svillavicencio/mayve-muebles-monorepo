import { Injectable } from '@nestjs/common';
import { Prisma } from '@mayve/database';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  ProductRepository,
  ProductFilter,
} from '../../domain/repositories/product.repository';
import { Product, Category } from '../../domain/entities/product.entity';
import { CategoryNotEmptyException } from '../../domain/exceptions/category-not-empty.exception';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProducts(filter?: ProductFilter): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: filter?.featured === true ? { isFeatured: true } : undefined,
      include: {
        images: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });
    return products.map((p: any) => this.mapToDomain(p));
  }

  async findProductBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });
    if (!product) return null;
    return this.mapToDomain(product);
  }

  async findCategories(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();
    return categories.map((c: any) => new Category(c.id, c.name, c.slug));
  }

  async createCategory(name: string, slug: string): Promise<Category> {
    const category = await this.prisma.category.create({
      data: { name, slug },
    });
    return new Category(category.id, category.name, category.slug);
  }

  async updateCategory(
    id: string,
    name: string,
    slug: string,
  ): Promise<Category | null> {
    const category = await this.prisma.category.update({
      where: { id },
      data: { name, slug },
    });
    return new Category(category.id, category.name, category.slug);
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      await this.prisma.category.delete({ where: { id } });
      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new CategoryNotEmptyException();
      }
      throw error;
    }
  }

  async isSlugAvailable(slug: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { slug },
    });
    return count === 0;
  }

  async findMaxSlugSuffix(baseSlug: string): Promise<number> {
    const products = await this.prisma.product.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
      select: {
        slug: true,
      },
    });

    if (products.length === 0) return -1;

    let maxSuffix = -1;

    for (const product of products) {
      if (product.slug === baseSlug) {
        maxSuffix = Math.max(maxSuffix, 0);
        continue;
      }

      const match = product.slug.match(new RegExp(`^${baseSlug}-(\\d+)$`));
      if (match) {
        const suffix = parseInt(match[1], 10);
        maxSuffix = Math.max(maxSuffix, suffix);
      }
    }

    return maxSuffix;
  }

  async create(data: Omit<Product, 'id'>): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        leadTime: data.leadTime,
        isCustomizable: data.isCustomizable,
        listPrice: data.listPrice,
        cashDiscountPrice: data.cashDiscountPrice,
        inStock: data.inStock,
        requiresAssembly: data.requiresAssembly,
        materials: data.materials,
        dimensions: data.dimensions,
        structure: data.structure,
        finish: data.finish,
        fabric: data.fabric,
        shippingWeight: data.shippingWeight,
        isFeatured: data.isFeatured,
        images: {
          create: data.images.map((url, index) => ({
            url,
            isMain: index === 0,
          })),
        },
      },
      include: { images: true },
    });
    return this.mapToDomain(product);
  }

  async update(
    id: string,
    data: Partial<Omit<Product, 'id'>>,
  ): Promise<Product | null> {
    const updateData: any = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      leadTime: data.leadTime,
      isCustomizable: data.isCustomizable,
      listPrice: data.listPrice,
      cashDiscountPrice: data.cashDiscountPrice,
      inStock: data.inStock,
      requiresAssembly: data.requiresAssembly,
      materials: data.materials,
      dimensions: data.dimensions,
      structure: data.structure,
      finish: data.finish,
      fabric: data.fabric,
      shippingWeight: data.shippingWeight,
      isFeatured: data.isFeatured,
    };

    if (data.images) {
      updateData.images = {
        deleteMany: {},
        create: data.images.map((url, index) => ({
          url,
          isMain: index === 0,
        })),
      };
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { images: true },
    });
    return this.mapToDomain(product);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.image.deleteMany({
      where: { productId: id },
    });
    await this.prisma.product.delete({
      where: { id },
    });
    return true;
  }

  private mapToDomain(p: any): Product {
    const rawCat = p.category as
      | { id: string; name: string; slug: string }
      | null
      | undefined;
    return new Product(
      p.id,
      p.name,
      p.slug,
      p.description,
      Number(p.price),
      p.categoryId,
      p.leadTime,
      p.isCustomizable,
      Number(p.listPrice),
      Number(p.cashDiscountPrice),
      p.inStock,
      p.requiresAssembly,
      p.materials ?? undefined,
      p.dimensions ?? undefined,
      p.structure ?? undefined,
      p.finish ?? undefined,
      p.fabric ?? undefined,
      p.shippingWeight ? Number(p.shippingWeight) : undefined,
      p.images.map((img: any) => img.url),
      p.isFeatured,
      rawCat ? new Category(rawCat.id, rawCat.name, rawCat.slug) : undefined,
    );
  }
}
