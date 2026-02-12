import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductCreatedEvent } from '../types';

@Injectable()
export class ProductEventsPublisher implements OnModuleInit {
  private readonly logger = new Logger(ProductEventsPublisher.name);

  constructor(
    @Inject('SEARCH_EVENTS_CLIENT')
    private readonly searchEventsClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.searchEventsClient.connect();
    this.logger.log('Connected to RabbitMQ Search queue.');
  }

  productCreated(eventPayload: ProductCreatedEvent) {
    try {
      this.searchEventsClient.emit('product.created', eventPayload);
      this.logger.log('Published product created event.');
    } catch {
      this.logger.error('Failed to publish product created event.');
    }
  }
}
