import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { DatabaseModule } from './shared/database/database.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { EmpresaModule } from './modules/empresas/empresa.module';
import { FuncionarioModule } from './modules/funcionarios/funcionario.module';
import { EmprestimoModule } from './modules/emprestimos/emprestimo.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    EmpresaModule,
    FuncionarioModule,
    EmprestimoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
