import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { applyToMicroserviceLayer } from '@app/rpc';

async function bootstrap() {
  process.title = 'media';
  const logger = new Logger('MediaBootstrap');

  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const queue = process.env.MEDIA_QUEUE;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
    { transport: Transport.RMQ, options: { urls: [rmqUrl], queue } },
  );

  applyToMicroserviceLayer(app);

  app.enableShutdownHooks();

  await app.listen();

  logger.log(`Media service (RMQ) is listening queue:${queue} on ${rmqUrl}`);
}
bootstrap();
