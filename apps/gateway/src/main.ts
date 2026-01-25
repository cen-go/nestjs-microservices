import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  process.title = 'gateway';
  const logger = new Logger('Gateway');

  const port = process.env.GATEWAY_PORT
    ? parseInt(process.env.GATEWAY_PORT)
    : 3000;

  const app = await NestFactory.create(GatewayModule);

  app.enableShutdownHooks();

  await app.listen(port);

  logger.log(`Gateway listening on port ${port}`);
}
bootstrap();
