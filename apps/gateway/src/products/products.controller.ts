import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  Param,
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
import { catchError, throwError } from 'rxjs';

@Controller()
export class ProductsHttpController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
  ) {}

  @Post('products/create')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createProduct(@Body() data: ClientCreateProductDto) {
    return this.catalogClient.send(CATALOG_PATTERNS.CREATE, data).pipe(
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
