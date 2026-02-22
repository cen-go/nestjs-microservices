import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ProductsHttpController } from './products/products.controller';
import { SearchHttpController } from './search/search.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    ClientsModule.register([
      {
        name: 'CATALOG_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: process.env.CATALOG_QUEUE,
        },
      },
      {
        name: 'MEDIA_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: process.env.MEDIA_QUEUE,
        },
      },
      {
        name: 'SEARCH_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: process.env.SEARCH_QUEUE,
        },
      },
      {
        name: 'AUTH_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: process.env.AUTH_QUEUE,
        },
      },
    ]),
  ],
  controllers: [
    GatewayController,
    ProductsHttpController,
    SearchHttpController,
  ],
  providers: [GatewayService, JwtStrategy],
})
export class GatewayModule {}
