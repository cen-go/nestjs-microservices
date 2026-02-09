import { RpcErrorPayload } from './rpc.types';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function mapRpcErrorToHttp(err: RpcErrorPayload) {
  const { code, message } = err;
  const details = err.details ?? [];
  console.log('MAPPER EXECUTED', err);

  switch (code) {
    case 'BAD_REQUEST':
    case 'VALIDATION_ERROR':
      console.log('mapper triggered');
      throw new BadRequestException(`${message}: ${details.join(', ')}`);
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
