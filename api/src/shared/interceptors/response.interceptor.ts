import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { SKIP_RESPONSE_INTERCEPTOR } from '../decorators/SkipResponseInterceptor';

export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, Response<T> | T>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T> | T> {
    const skipInterceptor = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_INTERCEPTOR,
      [context.getHandler(), context.getClass()],
    );

    if (skipInterceptor) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // Se já é uma resposta formatada, retorna como está
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        
        return {
          success: true,
          data,
          message: 'Success',
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
} 