import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  process.title = 'auth';
  const logger = new Logger('AuthBootstrap');

  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const queue = process.env.AUTH_QUEUE;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    { transport: Transport.RMQ, options: { urls: [rmqUrl], queue } },
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();

  logger.log(`Auth service (RMQ) is listening queue:${queue} on ${rmqUrl}`);
}
bootstrap();
