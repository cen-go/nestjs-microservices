import { IsOptional, IsString } from 'class-validator';

export class UploadProductImageDto {
  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;

  @IsString()
  base64: string;

  @IsString()
  uploaderId: string;
}

export class AttachToProductDto {
  @IsString()
  MediaId: string;

  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  uploaderId?: string;
}
