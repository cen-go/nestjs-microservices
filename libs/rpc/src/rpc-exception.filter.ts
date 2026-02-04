import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { RpcErrorPayload } from './rpc.types';

@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter {
  catch(
    exception: RpcException | HttpException,
    host: ArgumentsHost,
  ): Observable<any> {
    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }

    const status = exception.getStatus();

    if (status === 400) {
      const errorPayload: RpcErrorPayload = {
        code: 'VALIDATION_ERROR',
        message: 'Validation error',
        statusCode: 400,
      };
      return super.catch(new RpcException(errorPayload), host);
    }

    const errorPayload: RpcErrorPayload = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      statusCode: 500,
    };
    return super.catch(new RpcException(errorPayload), host);
  }
}
