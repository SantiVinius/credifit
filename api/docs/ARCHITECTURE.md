# 🏗️ Arquitetura do CrediFit API

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Decisões Arquiteturais](#decisões-arquiteturais)
- [Padrões de Design](#padrões-de-design)
- [Estrutura de Camadas](#estrutura-de-camadas)
- [Fluxo de Dados](#fluxo-de-dados)
- [Segurança](#segurança)
- [Performance](#performance)
- [Escalabilidade](#escalabilidade)

## 🎯 Visão Geral

O CrediFit API foi projetado seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, com foco em:

- **Manutenibilidade**: Código limpo e bem estruturado
- **Testabilidade**: Arquitetura que facilita testes
- **Escalabilidade**: Preparado para crescimento
- **Segurança**: Múltiplas camadas de proteção

## 🔧 Decisões Arquiteturais

### 1. Framework: NestJS

**Decisão**: Utilizar NestJS como framework principal

**Justificativa**:
- ✅ **Arquitetura modular**: Facilita organização e manutenção
- ✅ **Dependency Injection**: Promove baixo acoplamento
- ✅ **Decorators**: Sintaxe limpa e expressiva
- ✅ **TypeScript nativo**: Tipagem forte e melhor DX
- ✅ **Ecosistema maduro**: Muitas bibliotecas e ferramentas
- ✅ **Documentação excelente**: Fácil aprendizado e troubleshooting

### 2. ORM: Prisma

**Decisão**: Utilizar Prisma como ORM

**Justificativa**:
- ✅ **Type Safety**: Geração automática de tipos TypeScript
- ✅ **Schema-first**: Migrations automáticas e seguras
- ✅ **Query Builder**: Sintaxe intuitiva e poderosa
- ✅ **Prisma Studio**: Interface visual para dados
- ✅ **Performance**: Queries otimizadas automaticamente
- ✅ **Developer Experience**: Excelente tooling

### 3. Banco de Dados: PostgreSQL

**Decisão**: Utilizar PostgreSQL como banco principal

**Justificativa**:
- ✅ **ACID Compliance**: Garantia de consistência
- ✅ **Relacional**: Modelo bem definido para domínio financeiro
- ✅ **Performance**: Excelente para operações complexas
- ✅ **JSON Support**: Flexibilidade quando necessário
- ✅ **Maturidade**: Estável e bem documentado

### 4. Autenticação: JWT

**Decisão**: Utilizar JWT para autenticação

**Justificativa**:
- ✅ **Stateless**: Não requer armazenamento no servidor
- ✅ **Escalabilidade**: Funciona bem com múltiplas instâncias
- ✅ **Performance**: Menos consultas ao banco
- ✅ **Padrão da indústria**: Amplamente adotado

## 🎨 Padrões de Design

### 1. Repository Pattern

**Implementação**: `src/shared/database/repositories/`

```typescript
// Exemplo: FuncionarioRepository
export class FuncionarioRepository {
  async findUnique(params: Prisma.FuncionarioFindUniqueArgs) {
    return this.prisma.funcionario.findUnique(params);
  }
  
  async create(params: Prisma.FuncionarioCreateArgs) {
    return this.prisma.funcionario.create(params);
  }
}
```

**Benefícios**:
- ✅ Abstração da camada de dados
- ✅ Facilita testes com mocks
- ✅ Centraliza lógica de acesso a dados
- ✅ Permite troca de implementação

### 2. Service Layer Pattern

**Implementação**: `src/modules/*/services/`

```typescript
// Exemplo: EmprestimoService
@Injectable()
export class EmprestimoService {
  constructor(
    private readonly funcionarioRepo: FuncionarioRepository,
    private readonly emprestimoRepo: EmprestimoRepository,
  ) {}
  
  async simular(data: SimulateEmprestimo, userId: string) {
    // Lógica de negócio centralizada
  }
}
```

**Benefícios**:
- ✅ Separação de responsabilidades
- ✅ Reutilização de lógica
- ✅ Facilita testes unitários
- ✅ Controle de transações

### 3. Decorator Pattern

**Implementação**: `src/shared/decorators/`

```typescript
// Exemplo: ActiveUserId
export const ActiveUserId = createParamDecorator<undefined>(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.userId;
  },
);
```

**Benefícios**:
- ✅ Reutilização de código
- ✅ Sintaxe limpa
- ✅ Separação de concerns
- ✅ Facilita testes

### 4. Interceptor Pattern

**Implementação**: `src/shared/interceptors/`

```typescript
// Exemplo: ResponseInterceptor
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        message: 'Success',
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

**Benefícios**:
- ✅ Formatação consistente de respostas
- ✅ Logging centralizado
- ✅ Transformação de dados
- ✅ Tratamento de erros

## 🏛️ Estrutura de Camadas

### 1. Presentation Layer (Controllers)

**Responsabilidades**:
- Receber requisições HTTP
- Validação de entrada
- Autenticação e autorização
- Formatação de resposta

**Localização**: `src/modules/*/controllers/`

### 2. Business Logic Layer (Services)

**Responsabilidades**:
- Regras de negócio
- Orquestração de operações
- Validações complexas
- Integração com serviços externos

**Localização**: `src/modules/*/services/`

### 3. Data Access Layer (Repositories)

**Responsabilidades**:
- Acesso a dados
- Queries complexas
- Cache (quando aplicável)
- Abstração do banco

**Localização**: `src/shared/database/repositories/`

### 4. Infrastructure Layer

**Responsabilidades**:
- Configuração de banco
- Middleware de segurança
- Logging
- Monitoramento

**Localização**: `src/shared/`

## 🔄 Fluxo de Dados

### Fluxo Típico de Requisição

```
1. HTTP Request
   ↓
2. Guards (Auth, Rate Limit)
   ↓
3. Validation Pipes
   ↓
4. Controller
   ↓
5. Service (Business Logic)
   ↓
6. Repository (Data Access)
   ↓
7. Database
   ↓
8. Response Interceptor
   ↓
9. HTTP Response
```

### Exemplo: Criação de Empréstimo

```typescript
// 1. Controller recebe requisição
@Post()
async create(@ActiveUserId() userId: string, @Body() dto: CreateEmprestimoDto) {
  return this.emprestimoService.create(dto, userId);
}

// 2. Service processa lógica de negócio
async create(data: CreateEmprestimoDto, userId: string) {
  // Validações
  // Consulta score
  // Cria empréstimo
  // Gera parcelas
  // Simula pagamento
}

// 3. Repository acessa dados
async create(params: Prisma.EmprestimoCreateArgs) {
  return this.prisma.emprestimo.create(params);
}
```

## 🔒 Segurança

### 1. Autenticação

- **JWT Tokens**: Autenticação stateless
- **bcryptjs**: Hash seguro de senhas
- **Rate Limiting**: Proteção contra força bruta

### 2. Validação

- **class-validator**: Validação de entrada
- **CPF/CNPJ Validation**: Validação de documentos
- **Sanitização**: Limpeza de dados

### 3. Autorização

- **Guards**: Controle de acesso
- **Decorators**: Extração de dados do usuário
- **Role-based**: Preparado para roles futuras

### 4. Rate Limiting

```typescript
// Geral: 100 requests/15min
@UseGuards(RateLimitGuard)

// Autenticação: 10 requests/5min
@UseGuards(AuthRateLimitGuard)
```

## 🧪 Testabilidade

### 1. Unit Tests

- **Dependency Injection**: Facilita mocking
- **Repository Pattern**: Isola camada de dados
- **Service Layer**: Testa lógica de negócio

## 📚 Referências

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://domainlanguage.com/ddd/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

*Esta documentação é um living document e será atualizada conforme o projeto evolui.* 