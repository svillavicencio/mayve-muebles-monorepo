import { Product, Category } from '../entities/product.entity';

export interface ProductFilter {
  featured?: boolean;
}

export interface ProductRepository {
  findProducts(filter?: ProductFilter): Promise<Product[]>;
  findProductBySlug(slug: string): Promise<Product | null>;
  findCategories(): Promise<Category[]>;
  createCategory(name: string, slug: string): Promise<Category>;
  updateCategory(id: string, name: string, slug: string): Promise<Category | null>;
  deleteCategory(id: string): Promise<boolean>;
  isSlugAvailable(slug: string): Promise<boolean>;
  findMaxSlugSuffix(baseSlug: string): Promise<number>;
  create(data: Omit<Product, 'id'>): Promise<Product>;
  update(id: string, data: Partial<Omit<Product, 'id'>>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
