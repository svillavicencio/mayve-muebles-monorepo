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
} from '@nestjs/common';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { CreateProductDto } from './dtos/create-product.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.createProductUseCase.execute({
      ...createProductDto,
      isFeatured: createProductDto.isFeatured ?? false,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() updateData: any) {
    const product = await this.updateProductUseCase.execute(id, updateData);
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
