import { Controller } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Product } from '@prisma/catalog-client';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern('service.ping')
  ping() {
    return this.catalogService.ping();
  }

  @MessagePattern('product.create')
  createProduct(
    @Payload() data: { name: string; price: number },
  ): Promise<Product> {
    return this.catalogService.createProduct(data);
  }

  @MessagePattern('product.list')
  getProducts(): Promise<Product[]> {
    return this.catalogService.getProducts();
  }
}
