# 🏦 CrediFit API

> Plataforma de empréstimos para funcionários - API Backend

[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.6.0-green.svg)](https://www.prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-29.7.0-yellow.svg)](https://jestjs.io/)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API Documentation](#-api-documentation)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)

## 🎯 Sobre o Projeto

O **CrediFit** é uma plataforma inovadora que permite empresas oferecerem empréstimos para seus funcionários de forma segura, controlada e transparente. O sistema automatiza todo o processo de análise de crédito, simulação de empréstimos e gestão de parcelas.

### 🎯 Objetivos

- **Facilitar o acesso ao crédito** para funcionários
- **Automatizar processos** de análise e aprovação
- **Garantir segurança** e conformidade regulatória
- **Fornecer transparência** total nas operações

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- **JWT Authentication**: Sistema seguro de autenticação
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Validação de Dados**: Validação robusta de entrada
- **CPF/CNPJ Validation**: Validação de documentos brasileiros

### 🏢 Gestão de Empresas
- Cadastro de empresas com validação de CNPJ
- Gestão de representantes legais
- Controle de funcionários por empresa

### 👥 Gestão de Funcionários
- Cadastro de funcionários com validação de CPF
- Controle de salários e margem de crédito
- Vinculação automática à empresa

### 💰 Sistema de Empréstimos
- **Simulação**: Cálculo automático de parcelas (1-4x)
- **Análise de Crédito**: Score baseado em faixas salariais
- **Margem de Crédito**: Limite de 35% do salário
- **Aprovação Automática**: Baseada em score e margem
- **Gestão de Parcelas**: Criação automática de parcelas

## 🏗️ Arquitetura

### Estrutura do Projeto
```
src/
├── modules/           # Módulos da aplicação
│   ├── auth/         # Autenticação
│   ├── empresas/     # Gestão de empresas
│   ├── funcionarios/ # Gestão de funcionários
│   └── emprestimos/  # Sistema de empréstimos
├── shared/           # Recursos compartilhados
│   ├── config/       # Configurações
│   ├── database/     # Camada de dados
│   ├── decorators/   # Decorators customizados
│   ├── guards/       # Guards de segurança
│   ├── interceptors/ # Interceptors
│   └── pipes/        # Pipes de validação
└── utils/            # Utilitários
```

### Padrões Arquiteturais

- **Domain-Driven Design (DDD)**: Organização por domínios de negócio
- **Repository Pattern**: Abstração da camada de dados
- **Dependency Injection**: Inversão de controle
- **SOLID Principles**: Princípios de design orientado a objetos
- **Clean Architecture**: Separação de responsabilidades

## 🛠️ Tecnologias

### Core
- **[NestJS](https://nestjs.com/)**: Framework Node.js para aplicações escaláveis
- **[TypeScript](https://www.typescriptlang.org/)**: Linguagem tipada
- **[Prisma](https://www.prisma.io/)**: ORM moderno para Node.js

### Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional

### Autenticação e Segurança
- **[JWT](https://jwt.io/)**: JSON Web Tokens
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js/)**: Hash de senhas
- **[class-validator](https://github.com/typestack/class-validator)**: Validação de dados

### Testes
- **[Jest](https://jestjs.io/)**: Framework de testes
- **[Supertest](https://github.com/visionmedia/supertest)**: Testes de integração

### Documentação
- **[Swagger/OpenAPI](https://swagger.io/)**: Documentação da API

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **Yarn** >= 1.22.0
- **PostgreSQL** >= 14.0
- **Git**

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/credifit-api.git
cd credifit-api
```

2. **Instale as dependências**
```bash
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

4. **Configure o banco de dados**
```bash
# Configure as variáveis no .env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/credifit"

# Execute as migrações
yarn prisma migrate dev
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/credifit"

# JWT
JWT_SECRET="sua-chave-secreta-muito-segura"

# API
PORT=3000
NODE_ENV=development

# External APIs (para simulação)
SCORE_API_URL="https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf"
PAYMENT_API_URL="https://mocki.io/v1/386c594b-d42f-4d14-8036-508a0cf1264c"
```

### Configuração do Banco

```bash
# Gerar cliente Prisma
yarn prisma generate

# Executar migrações
yarn prisma migrate dev

# Visualizar dados (opcional)
yarn prisma studio
```

## 🎮 Uso

### Desenvolvimento
```bash
# Modo desenvolvimento com hot reload
yarn start:dev

# Modo debug
yarn start:debug
```

### Produção
```bash
# Build da aplicação
yarn build

# Executar em produção
yarn start:prod
```

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `yarn start` | Inicia a aplicação |
| `yarn start:dev` | Modo desenvolvimento |
| `yarn start:debug` | Modo debug |
| `yarn start:prod` | Modo produção |
| `yarn build` | Build da aplicação |
| `yarn test` | Executa testes unitários |
| `yarn test:watch` | Testes em modo watch |
| `yarn test:cov` | Testes com cobertura |
| `yarn test:e2e` | Testes end-to-end |
| `yarn lint` | Executa o linter |
| `yarn format` | Formata o código |

## 📚 API Documentation

### Swagger UI
Acesse a documentação interativa da API em:
```
http://localhost:3000/api
```

### Endpoints Principais

#### 🔐 Autenticação
- `POST /auth/signin` - Login de funcionário
- `POST /auth/signup` - Cadastro de funcionário

#### 🏢 Empresas
- `POST /empresas` - Cadastrar empresa
- `GET /empresas` - Listar empresas
- `GET /empresas/:id` - Buscar empresa
- `PUT /empresas/:id` - Atualizar empresa
- `DELETE /empresas/:id` - Deletar empresa

#### 👥 Funcionários
- `POST /funcionarios` - Cadastrar funcionário
- `GET /funcionarios` - Listar funcionários
- `GET /funcionarios/:id` - Buscar funcionário
- `PUT /funcionarios/:id` - Atualizar funcionário
- `DELETE /funcionarios/:id` - Deletar funcionário

#### 💰 Empréstimos
- `POST /emprestimos/simulacao` - Simular empréstimo
- `POST /emprestimos` - Criar empréstimo
- `GET /emprestimos` - Listar empréstimos do usuário

### Exemplo de Uso

```bash
# 1. Cadastrar empresa
curl -X POST http://localhost:3000/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "razaoSocial": "Empresa Exemplo LTDA",
    "cnpj": "11.222.333/0001-81",
    "nomeRepresentante": "João Silva",
    "cpfRepresentante": "123.456.789-09",
    "emailRepresentante": "joao@empresa.com"
  }'

# 2. Cadastrar funcionário
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "cpf": "987.654.321-00",
    "salario": 3500.00,
    "email": "maria@empresa.com",
    "password": "senha123",
    "idEmpresa": "uuid-da-empresa"
  }'

# 3. Fazer login
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@empresa.com",
    "password": "senha123"
  }'

# 4. Simular empréstimo
curl -X POST http://localhost:3000/emprestimos/simulacao \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "valorSolicitado": 1000.00
  }'
```

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
yarn test

# Testes com cobertura
yarn test:cov

# Testes end-to-end
yarn test:e2e

# Testes em modo watch
yarn test:watch
```

### Cobertura de Testes
O projeto possui cobertura abrangente de testes:

- ✅ **Validadores**: CPF, CNPJ, Email
- ✅ **Serviços de Validação**: Empresas e Funcionários
- ✅ **Serviço de Empréstimos**: Lógica de negócio
- ✅ **Guards de Segurança**: Rate limiting
- ✅ **Decorators**: ActiveUserId
- ✅ **Interceptors**: Response formatting

### Estrutura de Testes
```
src/
├── **/*.spec.ts     # Testes unitários
└── **/*.e2e-spec.ts # Testes end-to-end
```

### Padrões de Código

- **TypeScript**: Use tipagem forte
- **ESLint**: Siga as regras de linting
- **Prettier**: Formatação automática
- **Commits**: Use conventional commits
- **Testes**: Mantenha cobertura alta

### Conventional Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de build
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Vínius Santi** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/SantiVinius)

## 🙏 Agradecimentos

- [NestJS](https://nestjs.com/) - Framework incrível
- [Prisma](https://www.prisma.io/) - ORM moderno
- [Jest](https://jestjs.io/) - Framework de testes
