import { Controller } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Product } from '@prisma/catalog-db-client';
import {
  CreateProductDto,
  getProductByIdDto,
} from '@app/contracts/catalog/create-product.dto';
import { CATALOG_PATTERNS } from '@app/contracts';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern(CATALOG_PATTERNS.PING)
  ping() {
    return this.catalogService.ping();
  }

  @MessagePattern(CATALOG_PATTERNS.CREATE)
  createProduct(@Payload() data: CreateProductDto): Promise<Product> {
    return this.catalogService.createProduct(data);
  }

  @MessagePattern(CATALOG_PATTERNS.LIST)
  getProducts(): Promise<Product[]> {
    return this.catalogService.getProducts();
  }

  @MessagePattern(CATALOG_PATTERNS.FIND_ONE)
  getProductById(@Payload() payload: getProductByIdDto): Promise<Product> {
    return this.catalogService.getProductById(payload.id);
  }
}
