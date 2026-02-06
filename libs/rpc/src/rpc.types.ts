export type RpcErrorCode =
  | 'INTERNAL_SERVER_ERROR'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'VALIDATION_ERROR';

export interface RpcErrorPayload {
  code: RpcErrorCode;
  message: string;
  details?: string[];
  statusCode: number;
}
