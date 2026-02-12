import { ProductStatus } from '@prisma/search-db-client';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductCreatedDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsIn(['ACTIVE', 'INACTIVE', 'DRAFT'])
  status: ProductStatus;
}
