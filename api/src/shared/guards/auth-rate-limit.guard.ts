import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  private requestCounts = new Map<string, { count: number; resetTime: number }>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp = request.ip || request.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 1 * 60 * 1000; // 1 minuto (mais permissivo)
    const maxRequests = 1000; // máximo 1000 tentativas por minuto (muito mais permissivo para desenvolvimento)

    const clientData = this.requestCounts.get(clientIp);

    if (!clientData || now > clientData.resetTime) {
      // Primeira requisição ou janela expirada
      this.requestCounts.set(clientIp, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (clientData.count >= maxRequests) {
      throw new HttpException(
        'Too many authentication attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    clientData.count++;
    return true;
  }
} 