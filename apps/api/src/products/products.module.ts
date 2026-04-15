import { Module } from '@nestjs/common';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { CategoriesController } from './infrastructure/controllers/categories.controller';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { SlugGenerator } from './domain/services/slug-generator';
import { ProductSlugService } from './domain/services/product-slug.service';
import { StorageModule } from '../common/storage/storage.module';
import { SupabaseModule } from '../common/supabase/supabase.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Module({
  imports: [StorageModule, SupabaseModule],
  controllers: [ProductsController, CategoriesController],
  providers: [
    GetProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    SlugGenerator,
    ProductSlugService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
    SupabaseAuthGuard,
    JwtAuthGuard,
  ],
  exports: [
    GetProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    ProductSlugService,
  ],
})
export class ProductsModule {}
