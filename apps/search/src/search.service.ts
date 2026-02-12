import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ProductStatus } from '@prisma/search-db-client';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  normalizeText(name: string, description: string) {
    return `${name} ${description}`.toLowerCase();
  }

  async upsertFromCatalogEvent(payload: {
    productId: string;
    name: string;
    description: string;
    price: number;
    status: ProductStatus;
  }) {
    const normalizedText = this.normalizeText(
      payload.name,
      payload.description,
    );

    const updateData = {
      name: payload.name,
      price: payload.price,
      status: payload.status,
      normalizedText,
    };

    await this.prisma.product.upsert({
      where: { productId: payload.productId },
      update: updateData,
      create: {
        productId: payload.productId,
        ...updateData,
      },
    });

    console.log(`Search document created for the product: ${payload.name}`);
  }

  async search({ query, limit = 10 }: { query: string; limit?: number }) {
    const normalizedQuery = query.toLowerCase();
    return await this.prisma.product.findMany({
      where: { normalizedText: { contains: normalizedQuery } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  ping() {
    return {
      ok: true,
      service: 'search',
      now: new Date().toLocaleString(),
    };
  }
}
