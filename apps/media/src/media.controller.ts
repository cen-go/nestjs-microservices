import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AttachToProductDto,
  UploadProductImageDto,
} from '@app/contracts/media/media.dto';
import { MEDIA_PATTERNS } from '@app/contracts/media/media.patterns';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('service.ping')
  ping() {
    return this.mediaService.ping();
  }

  @MessagePattern(MEDIA_PATTERNS.UPLOAD_PRODUCT_IMAGE)
  uploadProductImage(@Payload() data: UploadProductImageDto) {
    return this.mediaService.uploadProductImage(data);
  }

  @MessagePattern(MEDIA_PATTERNS.ATTACH_TO_PRODUCT)
  attachToProduct(@Payload() data: AttachToProductDto) {
    return this.mediaService.attachToProduct(data);
  }
}
