import { RpcException } from '@nestjs/microservices';
import { RpcErrorPayload } from './rpc.types';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function mapRpcErrorToHttp(err: RpcException) {
  const payload = err.getError() as RpcErrorPayload;

  const { code, message } = payload;

  switch (code) {
    case 'BAD_REQUEST':
    case 'VALIDATION_ERROR':
      throw new BadRequestException(message);
    case 'NOT_FOUND':
      throw new NotFoundException(message);
    case 'UNAUTHORIZED':
      throw new UnauthorizedException(message);
    case 'FORBIDDEN':
      throw new ForbiddenException(message);
    case 'CONFLICT':
      throw new ConflictException(message);
    case 'INTERNAL_SERVER_ERROR':
      break;
    default:
      throw new InternalServerErrorException(message);
  }
}
