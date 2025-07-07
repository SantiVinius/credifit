import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private requestCounts = new Map<string, { count: number; resetTime: number }>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp = request.ip || request.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 1 * 60 * 1000; // 1 minuto
    const maxRequests = 10000; // máximo 10000 requests por minuto (muito mais permissivo para desenvolvimento)

    // Limpar entradas expiradas
    this.cleanupExpiredEntries();

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
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    clientData.count++;
    return true;
  }

  private cleanupExpiredEntries() {
    const now = Date.now();
    for (const [key, value] of this.requestCounts.entries()) {
      if (now > value.resetTime) {
        this.requestCounts.delete(key);
      }
    }
  }

  // Método para limpar cache (útil para desenvolvimento)
  clearCache() {
    this.requestCounts.clear();
  }
} 