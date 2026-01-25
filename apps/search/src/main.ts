import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  process.title = 'search';
  const logger = new Logger('SearchBootstrap');

  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const queue = process.env.SEARCH_QUEUE;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
    { transport: Transport.RMQ, options: { urls: [rmqUrl], queue } },
  );

  app.enableShutdownHooks();

  await app.listen();

  logger.log(`Search service (RMQ) is listening queue:${queue} on ${rmqUrl}`);
}
bootstrap();
