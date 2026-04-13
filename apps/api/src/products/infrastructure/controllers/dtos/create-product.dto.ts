import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  categoryId: string;

  @IsNumber()
  leadTime: number;

  @IsBoolean()
  isCustomizable: boolean;

  @IsNumber()
  listPrice: number;

  @IsNumber()
  cashDiscountPrice: number;

  @IsBoolean()
  inStock: boolean;

  @IsBoolean()
  requiresAssembly: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  materials?: string;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsString()
  @IsOptional()
  structure?: string;

  @IsString()
  @IsOptional()
  finish?: string;

  @IsString()
  @IsOptional()
  fabric?: string;

  @IsNumber()
  @IsOptional()
  shippingWeight?: number;
}
