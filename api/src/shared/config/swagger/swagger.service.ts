import { Injectable } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SwaggerConfig } from './swagger.config';

@Injectable()
export class SwaggerService {
  static setup(app: INestApplication) {
    const config = SwaggerConfig.getConfig();
    const options = SwaggerConfig.getOptions();
    const setupOptions = SwaggerConfig.getSetupOptions();

    const document = SwaggerModule.createDocument(app, config, options);
    
    SwaggerModule.setup('api', app, document, setupOptions);

    // Log para confirmar que o Swagger foi configurado
    console.log('📚 Swagger UI disponível em: http://localhost:3000/api');
    
    return document;
  }

  static setupDevelopment(app: INestApplication) {
    // Configuração específica para desenvolvimento
    const config = SwaggerConfig.getConfig();
    const options = SwaggerConfig.getOptions();
    
    const devSetupOptions = {
      ...SwaggerConfig.getSetupOptions(),
      swaggerOptions: {
        ...SwaggerConfig.getSetupOptions().swaggerOptions,
        // Habilita logs mais detalhados em desenvolvimento
        onComplete: () => {
          console.log('🔍 Swagger configurado com logs detalhados');
        },
      },
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document, devSetupOptions);

    console.log('🚀 Swagger UI (Dev) disponível em: http://localhost:3000/api');
    
    return document;
  }

  static setupProduction(app: INestApplication) {
    // Configuração específica para produção
    const config = SwaggerConfig.getConfig();
    const options = SwaggerConfig.getOptions();
    
    const prodSetupOptions = {
      ...SwaggerConfig.getSetupOptions(),
      swaggerOptions: {
        ...SwaggerConfig.getSetupOptions().swaggerOptions,
        // Remove logs em produção
        requestInterceptor: undefined,
        responseInterceptor: undefined,
        // Desabilita "Try it out" em produção (opcional)
        tryItOutEnabled: false,
      },
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document, prodSetupOptions);

    console.log('📚 Swagger UI (Production) disponível em: /api');
    
    return document;
  }

  static generateSpec(app: INestApplication) {
    const config = SwaggerConfig.getConfig();
    const options = SwaggerConfig.getOptions();
    
    return SwaggerModule.createDocument(app, config, options);
  }
} 