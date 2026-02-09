import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  AttachToProductDto,
  UploadProductImageDto,
} from '@app/contracts/media/media.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { rpcBadRequest, rpcNotFound } from '@app/rpc';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async uploadProductImage(input: UploadProductImageDto) {
    const cloudinaryResult = await this.cloudinary.uploadImage(input);
    const { public_id, url } = cloudinaryResult;

    const media = await this.prisma.media.create({
      data: {
        publicId: public_id,
        url,
        uploaderId: input.uploaderId,
      },
    });

    return {
      id: media.id,
      publicId: media.publicId,
      url: media.url,
    };
  }

  async attachToProduct(input: AttachToProductDto) {
    const media = await this.prisma.media.findUnique({
      where: { id: input.MediaId },
    });

    if (!media) {
      rpcNotFound('Media not found');
    }

    if (media && media.productId) {
      rpcBadRequest('Media already attached to a product');
    }

    const updatedMedia = await this.prisma.media.update({
      where: { id: input.MediaId },
      data: { productId: input.productId },
    });

    return {
      id: updatedMedia.id,
      publicId: updatedMedia.publicId,
      url: updatedMedia.url,
      productId: updatedMedia.productId,
    };
  }

  ping() {
    return {
      ok: true,
      service: 'media',
      now: new Date().toLocaleString(),
    };
  }
}
