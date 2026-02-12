import { Controller } from '@nestjs/common';
import { SearchService } from './search.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductCreatedDto } from '@app/contracts/search/product-events.dto';
import { SearchQueryDto } from '@app/contracts/search/search-query.dto';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @EventPattern('product.created')
  async onProductCreated(@Payload() payload: ProductCreatedDto) {
    await this.searchService.upsertFromCatalogEvent(payload);
  }

  @MessagePattern('search.query')
  search(@Payload() query: SearchQueryDto) {
    return this.searchService.search(query);
  }

  @MessagePattern('service.ping')
  ping() {
    return this.searchService.ping();
  }
}
