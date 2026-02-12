import { mapRpcErrorToHttp, RpcErrorPayload } from '@app/rpc';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

@Controller()
export class SearchHttpController {
  constructor(
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
  ) {}

  @Get('search')
  search(@Query('query') query: string, @Query('limit') limit: number) {
    return this.searchClient.send('search.query', { query, limit }).pipe(
      catchError((err: RpcErrorPayload) => {
        try {
          mapRpcErrorToHttp(err);
        } catch (e) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return throwError(() => e);
        }
        return throwError(() => err);
      }),
    );
  }
}
