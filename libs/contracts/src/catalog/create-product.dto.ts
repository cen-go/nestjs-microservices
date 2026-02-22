import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';

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
