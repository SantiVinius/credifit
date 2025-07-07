import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { SwaggerService } from './shared/config/swagger/swagger.service';
import { AppConfig } from './shared/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger baseada no ambiente
  if (AppConfig.swaggerEnabled) {
    if (AppConfig.isProduction) {
      SwaggerService.setupProduction(app);
    } else {
      SwaggerService.setupDevelopment(app);
    }
  }

  // Configuração de validação global
  app.useGlobalPipes(new ValidationPipe(AppConfig.validationConfig));

  // Configuração CORS
  app.enableCors({
    origin: AppConfig.corsOrigin,
    credentials: true,
  });

  const port = AppConfig.port;
  await app.listen(port);
  
  console.log(`🚀 Aplicação rodando na porta ${port}`);
  console.log(`🌍 Ambiente: ${AppConfig.nodeEnv}`);
}
bootstrap();
