export class AppConfig {
  static get port(): number {
    return parseInt(process.env.PORT || '3000', 10);
  }

  static get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  static get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  static get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  static get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  static get databaseUrl(): string {
    return process.env.DATABASE_URL || '';
  }

  static get jwtSecret(): string {
    return process.env.JWT_SECRET || 'default-secret';
  }

  static get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '86400';
  }

  static get corsOrigin(): string | string[] {
    const origin = process.env.CORS_ORIGIN;
    if (!origin) return '*';
    return origin.includes(',') ? origin.split(',') : origin;
  }

  static get swaggerEnabled(): boolean {
    if (this.isProduction) {
      return process.env.SWAGGER_ENABLED === 'true';
    }
    return true; // Sempre habilitado em desenvolvimento
  }

  static get validationConfig() {
    return {
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    };
  }

  static get rateLimitConfig() {
    return {
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    };
  }

  static get authRateLimitConfig() {
    return {
      max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),
      windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '300000', 10),
    };
  }
} 