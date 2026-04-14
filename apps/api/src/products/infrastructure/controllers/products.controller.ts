import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Inject,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { CreateProductDto } from './dtos/create-product.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import {
  STORAGE_SERVICE,
  type IStorageService,
} from '../../../common/storage/storage.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  @Get('categories')
  async getCategories() {
    return this.getProductsUseCase.getAllCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageUrls = await Promise.all(
      files.map((file) => this.storageService.saveFile(file)),
    );

    const rawDto = createProductDto as any;

    return this.createProductUseCase.execute({
      ...createProductDto,
      price: Number(rawDto.price),
      listPrice: Number(rawDto.listPrice),
      cashDiscountPrice: Number(rawDto.cashDiscountPrice),
      leadTime: Number(rawDto.leadTime),
      isFeatured: String(rawDto.isFeatured) === 'true',
      inStock: String(rawDto.inStock) === 'true',
      isCustomizable: String(rawDto.isCustomizable) === 'true',
      requiresAssembly: String(rawDto.requiresAssembly) === 'true',
      shippingWeight: rawDto.shippingWeight
        ? Number(rawDto.shippingWeight)
        : undefined,
      images: imageUrls,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async updateProduct(
    @Param('id') id: string,
    @Body() updateData: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    let imageUrls: string[] | undefined = undefined;

    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map((file) => this.storageService.saveFile(file)),
      );
    }

    // If existingImages is sent as a string or array of strings from frontend
    const existingImages = updateData.existingImages 
      ? (Array.isArray(updateData.existingImages) ? updateData.existingImages : [updateData.existingImages])
      : [];

    const finalImages = imageUrls ? [...existingImages, ...imageUrls] : (updateData.existingImages ? existingImages : undefined);

    const product = await this.updateProductUseCase.execute(id, {
      ...updateData,
      price: updateData.price ? Number(updateData.price) : undefined,
      listPrice: updateData.listPrice ? Number(updateData.listPrice) : undefined,
      cashDiscountPrice: updateData.cashDiscountPrice ? Number(updateData.cashDiscountPrice) : undefined,
      leadTime: updateData.leadTime ? Number(updateData.leadTime) : undefined,
      isFeatured: updateData.isFeatured !== undefined ? String(updateData.isFeatured) === 'true' : undefined,
      inStock: updateData.inStock !== undefined ? String(updateData.inStock) === 'true' : undefined,
      isCustomizable: updateData.isCustomizable !== undefined ? String(updateData.isCustomizable) === 'true' : undefined,
      requiresAssembly: updateData.requiresAssembly !== undefined ? String(updateData.requiresAssembly) === 'true' : undefined,
      shippingWeight: updateData.shippingWeight ? Number(updateData.shippingWeight) : undefined,
      images: finalImages,
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.deleteProductUseCase.execute(id);
  }

  @Get()
  async getProducts(@Query('featured') featured?: string) {
    const filter = featured === 'true' ? { featured: true } : undefined;
    return this.getProductsUseCase.getAllProducts(filter);
  }

  @Get(':slug')
  async getProduct(@Param('slug') slug: string) {
    const product = await this.getProductsUseCase.getProductBySlug(slug);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
