import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { RpcErrorPayload } from './rpc.types';

@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    console.log('EXCEPTION FILTER:', exception);
    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (status === 400) {
      const exceptionResponse = (exception as HttpException).getResponse();
      const exceptionDetail = exceptionResponse['message'] as string[];
      const errorPayload: RpcErrorPayload = {
        code: 'VALIDATION_ERROR',
        message: 'Validation error',
        details: exceptionDetail,
        statusCode: 400,
      };
      console.log(exception);
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
