import { Module } from '@nestjs/common';
import { SwaggerService } from './swagger/swagger.service';

@Module({
  providers: [SwaggerService],
  exports: [SwaggerService],
})
export class ConfigModule {} 