import { UploadProductImageDto } from '@app/contracts/media/media.dto';
import { rpcBadRequest, rpcInternalServerError } from '@app/rpc';
import { Inject, Injectable } from '@nestjs/common';
import { v2, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary: typeof v2) {}

  uploadImage(
    input: UploadProductImageDto,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!input.base64) {
      rpcBadRequest('base64 is required');
    }
    if (!input.mimeType.startsWith('image/')) {
      rpcBadRequest('file must be an image');
    }

    const buffer = Buffer.from(input.base64, 'base64');

    if (!buffer.length) {
      rpcBadRequest('file is empty');
    }

    return new Promise<UploadApiResponse | UploadApiErrorResponse>(
      (resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            folder: 'nest-microservices/products',
            resource_type: 'image',
          },
          (
            error: UploadApiErrorResponse,
            result: UploadApiResponse | undefined,
          ) => {
            if (error) {
              reject(new Error(error.message));
            } else if (!result) {
              reject(new Error('Upload result is undefined'));
            } else {
              resolve(result);
            }
          },
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
      },
    );
  }

  async removeImage(publicId: string): Promise<{ result: string } | undefined> {
    try {
      return (await this.cloudinary.uploader.destroy(publicId)) as {
        result: string;
      };
    } catch {
      rpcInternalServerError('Error removing image from Cloudinary');
    }
  }
}
