import { Controller, Get, Inject } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
  ) {}

  @Get('health')
  health() {
    const ping = async (client: ClientProxy) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await firstValueFrom(client.send('service.ping', {}));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
      } catch (error) {
        console.log(error);
      }
    };

    return Promise.all([
      ping(this.catalogClient),
      ping(this.mediaClient),
      ping(this.searchClient),
    ]);
  }
}
