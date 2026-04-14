import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.use-case';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategory(@Body('name') name: string) {
    return this.createCategoryUseCase.execute(name);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body('name') name: string) {
    const category = await this.updateCategoryUseCase.execute(id, name);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.deleteCategoryUseCase.execute(id);
  }
}
