import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UploadProductImageDto } from '@app/contracts/media/media.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async uploadProductImage(input: UploadProductImageDto) {}

  ping() {
    return {
      ok: true,
      service: 'media',
      now: new Date().toLocaleString(),
    };
  }
}
