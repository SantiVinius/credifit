import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

export class SwaggerConfig {
  static getConfig() {
    return new DocumentBuilder()
      .setTitle('CrediFit API')
      .setDescription(this.getDescription())
      .setVersion('1.0.0')
      .addTag('auth', 'Endpoints de autenticação')
      .addTag('empresas', 'Gestão de empresas')
      .addTag('funcionarios', 'Gestão de funcionários')
      .addTag('emprestimos', 'Gestão de empréstimos')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();
  }

  static getOptions(): SwaggerDocumentOptions {
    return {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    };
  }

  static getSetupOptions() {
    return {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        tryItOutEnabled: true,
        requestInterceptor: (req: any) => {
          // Log das requisições para debug
          console.log('Swagger Request:', req);
          return req;
        },
        responseInterceptor: (res: any) => {
          // Log das respostas para debug
          console.log('Swagger Response:', res);
          return res;
        },
      },
      customSiteTitle: 'CrediFit API Documentation',
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #2c3e50; }
        .swagger-ui .scheme-container { background: #f8f9fa; }
      `,
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
    };
  }

  private static getDescription(): string {
    return `
# CrediFit - API de Empréstimos para Funcionários

## Sobre o Projeto
O CrediFit é uma plataforma que permite empresas oferecerem empréstimos para seus funcionários de forma segura e controlada.

## Funcionalidades Principais
- **Autenticação**: Sistema de login e cadastro de funcionários
- **Empresas**: Cadastro e gestão de empresas
- **Funcionários**: Gestão de funcionários por empresa
- **Empréstimos**: Simulação e criação de empréstimos
- **Parcelas**: Gestão automática de parcelas

## Regras de Negócio
- Margem de crédito: 35% do salário do funcionário
- Score de crédito baseado em faixas salariais
- Parcelamento de 1 a 4 vezes
- Validação de CPF/CNPJ e e-mail

## Segurança
- Autenticação JWT
- Rate limiting por IP
- Rate limiting específico para autenticação
- Validação de dados de entrada

## Tecnologias
- NestJS (Framework)
- Prisma (ORM)
- PostgreSQL (Banco de dados)
- JWT (Autenticação)
- Class-validator (Validação)

## Como Usar
1. **Autenticação**: Use o endpoint \`/auth/signin\` para obter um token JWT
2. **Autorização**: Clique no botão "Authorize" e insira o token
3. **Teste**: Use os endpoints abaixo para testar a API

## Exemplos de Uso

### 1. Cadastrar Empresa
\`\`\`bash
POST /empresas
{
  "razaoSocial": "Empresa Exemplo LTDA",
  "cnpj": "11.222.333/0001-81",
  "nomeRepresentante": "João Silva",
  "cpfRepresentante": "123.456.789-09",
  "emailRepresentante": "joao@empresa.com"
}
\`\`\`

### 2. Cadastrar Funcionário
\`\`\`bash
POST /auth/signup
{
  "nome": "Maria Santos",
  "cpf": "987.654.321-00",
  "salario": 3500.00,
  "email": "maria@empresa.com",
  "password": "senha123",
  "idEmpresa": "uuid-da-empresa"
}
\`\`\`

### 3. Simular Empréstimo
\`\`\`bash
POST /emprestimos/simulacao
Authorization: Bearer seu-token-jwt
{
  "valorSolicitado": 1000.00
}
\`\`\`

## Códigos de Status
- \`200\`: Sucesso
- \`201\`: Criado com sucesso
- \`400\`: Dados inválidos
- \`401\`: Não autorizado
- \`403\`: Proibido
- \`404\`: Não encontrado
- \`409\`: Conflito (dados duplicados)
- \`429\`: Muitas requisições
- \`500\`: Erro interno do servidor

## Rate Limiting
- **Geral**: 100 requests por 15 minutos
- **Autenticação**: 10 requests por 5 minutos
`;
  }
}