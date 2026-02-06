import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ProductStatus } from '@prisma/catalog-db-client';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  userId: string;
}

export class getProductByIdDto {
  @IsString()
  id: string;
}
