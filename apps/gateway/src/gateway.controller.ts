import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  @Get('health')
  health() {
    const ping = async (client: ClientProxy) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await firstValueFrom(client.send('service.ping', {}));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
      } catch (error) {
        console.log(error);
      }
    };

    return Promise.all([
      ping(this.catalogClient),
      ping(this.mediaClient),
      ping(this.searchClient),
    ]);
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  createProduct(@Body() data: { name: string; price: number }) {
    return this.catalogClient.send('product.create', data);
  }

  @Get('products')
  @UseGuards(JwtAuthGuard)
  getProducts() {
    return 'Dummy response from gateway';
    // return this.catalogClient.send('product.list', {});
    return this.catalogClient.send('product.list', {});
  }

  @Post('auth/register')
  register(
    @Body() data: { email: string; password: string; userName: string },
  ) {
    return this.authClient.send('users.createUser', data).pipe(
      catchError((val: { message: string; statusCode: number }) => {
        return throwError(
          () => new HttpException(val.message, val.statusCode || 500),
        );
      }),
    );
  }

  @Post('auth/login')
  login(@Body() data: { userName: string; password: string }) {
    return this.authClient.send('auth.login', data).pipe(
      catchError((val: { message: string; statusCode: number }) => {
        return throwError(
          () => new HttpException(val.message, val.statusCode || 500),
        );
      }),
    );
  }
}
