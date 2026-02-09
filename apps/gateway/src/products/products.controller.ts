import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { mapRpcErrorToHttp, RpcErrorPayload } from '@app/rpc';
import {
  CATALOG_PATTERNS,
  CreateProductDto as ClientCreateProductDto,
} from '@app/contracts';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { MEDIA_PATTERNS } from '@app/contracts/media/media.patterns';
import { Request as ExpressRequest } from 'express';
import { CreatedProduct, RequestUser } from '../types';

@Controller()
export class ProductsHttpController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) {}

  @Post('products/create')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: 1024 * 1024 * 5 } }),
  )
  async createProduct(
    @Body() data: ClientCreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: ExpressRequest & { user: RequestUser },
  ) {
    try {
      let imageId: string | undefined;
      let imageUrl: string | undefined;

      if (file) {
        const base64 = file.buffer.toString('base64');
        const uploadResult: { id: string; publicId: string; url: string } =
          await firstValueFrom(
            this.mediaClient.send(MEDIA_PATTERNS.UPLOAD_PRODUCT_IMAGE, {
              fileName: file.originalname,
              mimeType: file.mimetype,
              base64,
              uploaderId: req.user.id,
            }),
          );

        imageId = uploadResult.id;
        imageUrl = uploadResult.url;
      }

      const CreatedProduct: CreatedProduct = await firstValueFrom(
        this.catalogClient.send(CATALOG_PATTERNS.CREATE, {
          ...data,
          imageUrl,
        }),
      );

      if (imageId) {
        await firstValueFrom(
          this.mediaClient.send(MEDIA_PATTERNS.ATTACH_TO_PRODUCT, {
            MediaId: imageId,
            productId: CreatedProduct.id,
          }),
        );
      }

      return CreatedProduct;
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        'statusCode' in error
      ) {
        mapRpcErrorToHttp(error as RpcErrorPayload);
      }
      throw error;
    }
  }

  @Get('products')
  getProducts() {
    return this.catalogClient.send(CATALOG_PATTERNS.LIST, {}).pipe(
      catchError((err: RpcErrorPayload) => {
        try {
          mapRpcErrorToHttp(err);
        } catch (e) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return throwError(() => e);
        }
        return throwError(() => err);
      }),
    );
  }

  @Get('products/:id')
  getProductById(@Param('id') id: string) {
    return this.catalogClient.send(CATALOG_PATTERNS.FIND_ONE, id).pipe(
      catchError((err: RpcErrorPayload) => {
        try {
          mapRpcErrorToHttp(err);
        } catch (e) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return throwError(() => e);
        }
        return throwError(() => err);
      }),
    );
  }
}
