import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Product } from '@prisma/catalog-db-client';
import { CreateProductDto } from '@app/contracts/catalog/create-product.dto';
import { rpcNotFound } from '@app/rpc';
import { ProductEventsPublisher } from './events/product-events.publisher';

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: ProductEventsPublisher,
  ) {}

  ping() {
    return {
      ok: true,
      service: 'catalog',
      now: new Date().toLocaleString(),
    };
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({ data });

    // Emit product created event
    this.events.productCreated({
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      status: product.status,
    });

    return product;
  }

  async getProducts(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      rpcNotFound('Product not found');
    }
    return product!;
  }
}
