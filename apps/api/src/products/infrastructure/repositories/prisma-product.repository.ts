import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@mayve/database';
import {
  ProductRepository,
  ProductFilter,
} from '../../domain/repositories/product.repository';
import { Product, Category } from '../../domain/entities/product.entity';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  private prisma = new PrismaClient();

  async findProducts(filter?: ProductFilter): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: filter?.featured === true ? { isFeatured: true } : undefined,
      include: {
        images: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });
    return products.map((p) => this.mapToDomain(p));
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
    return categories.map((c) => new Category(c.id, c.name, c.slug));
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
    await this.prisma.category.delete({
      where: { id },
    });
    return true;
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

      // Match baseSlug followed by a hyphen and digits
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
      },
      include: { images: true },
    });
    return this.mapToDomain(product);
  }

  async update(
    id: string,
    data: Partial<Omit<Product, 'id'>>,
  ): Promise<Product | null> {
    const product = await this.prisma.product.update({
      where: { id },
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
      },
      include: { images: true },
    });
    return this.mapToDomain(product);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.product.delete({
      where: { id },
    });
    return true;
  }

  private mapToDomain(p: any): Product {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const rawCat = p.category as { id: string; name: string; slug: string } | null | undefined;
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
