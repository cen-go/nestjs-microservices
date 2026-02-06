import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { applyToMicroserviceLayer } from '@app/rpc';

async function bootstrap() {
  process.title = 'catalog';
  const logger = new Logger('CatalogBootstrap');

  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const queue = process.env.CATALOG_QUEUE;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.RMQ,
      options: { urls: [rmqUrl], queue },
    },
  );

  applyToMicroserviceLayer(app);

  app.enableShutdownHooks();

  await app.listen();

  logger.log(`Catalog service (RMQ) is listening queue:${queue} on ${rmqUrl}`);
}
bootstrap();
