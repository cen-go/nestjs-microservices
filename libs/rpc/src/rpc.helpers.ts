import { RpcException } from '@nestjs/microservices';
import { RpcErrorPayload } from './rpc.types';

export function rpcBadRequest(message: string) {
  const errorPayload: RpcErrorPayload = {
    code: 'BAD_REQUEST',
    message,
    statusCode: 400,
  };
  throw new RpcException(errorPayload);
}

export function rpcInternalServerError(
  message: string = 'Internal Server Error',
) {
  const errorPayload: RpcErrorPayload = {
    code: 'INTERNAL_SERVER_ERROR',
    message,
    statusCode: 500,
  };
  throw new RpcException(errorPayload);
}

export function rpcNotFound(message: string) {
  const errorPayload: RpcErrorPayload = {
    code: 'NOT_FOUND',
    message,
    statusCode: 404,
  };
  throw new RpcException(errorPayload);
}

export function rpcUnauthorized(message: string = 'Unauthorized') {
  const errorPayload: RpcErrorPayload = {
    code: 'UNAUTHORIZED',
    message,
    statusCode: 401,
  };
  throw new RpcException(errorPayload);
}

export function rpcForbidden(message: string = 'Forbidden') {
  const errorPayload: RpcErrorPayload = {
    code: 'FORBIDDEN',
    message,
    statusCode: 403,
  };
  throw new RpcException(errorPayload);
}

export function rpcConflict(message: string) {
  const errorPayload: RpcErrorPayload = {
    code: 'CONFLICT',
    message,
    statusCode: 409,
  };
  throw new RpcException(errorPayload);
}

export function rpcValidationError(message: string) {
  const errorPayload: RpcErrorPayload = {
    code: 'VALIDATION_ERROR',
    message,
    statusCode: 400,
  };
  throw new RpcException(errorPayload);
}
