import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Product } from '@prisma/catalog-client';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  ping() {
    return {
      ok: true,
      service: 'catalog',
      now: new Date().toLocaleString(),
    };
  }

  async createProduct(data: { name: string; price: number }): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async getProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }
}
