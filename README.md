# 🏦 CrediFit - Plataforma de Empréstimos

> Sistema de empréstimos para funcionários com frontend React e backend NestJS

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.6.0-green.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC.svg)](https://tailwindcss.com/)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuição](#-contribuição)

## 🎯 Sobre o Projeto

O **CrediFit** é uma plataforma inovadora que permite empresas oferecerem empréstimos para seus funcionários de forma segura, controlada e transparente. O sistema automatiza todo o processo de análise de crédito, simulação de empréstimos e gestão de parcelas.

### 🎯 Objetivos

- **Facilitar o acesso ao crédito** para funcionários
- **Automatizar processos** de análise e aprovação
- **Garantir segurança** e conformidade regulatória
- **Fornecer transparência** total nas operações
- **Interface moderna** e intuitiva para usuários

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

### 🎨 Interface do Usuário
- **Design Responsivo**: Interface adaptável a diferentes dispositivos
- **Componentes Reutilizáveis**: Sistema de componentes modular
- **Formulários Intuitivos**: Validação em tempo real
- **Feedback Visual**: Notificações e alertas informativos

## 🏗️ Arquitetura

### Estrutura do Projeto
```
credifit/
├── api/                    # Backend NestJS
│   ├── src/
│   │   ├── modules/        # Módulos da aplicação
│   │   ├── shared/         # Recursos compartilhados
│   │   └── utils/          # Utilitários
│   ├── prisma/             # Configuração do banco
│   └── docs/               # Documentação da API
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   └── contexts/       # Contextos React
│   └── public/             # Arquivos públicos
└── README.md               # Este arquivo
```

### Padrões Arquiteturais

#### Backend (NestJS)
- **Domain-Driven Design (DDD)**: Organização por domínios de negócio
- **Repository Pattern**: Abstração da camada de dados
- **Dependency Injection**: Inversão de controle
- **SOLID Principles**: Princípios de design orientado a objetos
- **Clean Architecture**: Separação de responsabilidades

#### Frontend (React)
- **Component-Based Architecture**: Componentes reutilizáveis
- **Custom Hooks**: Lógica reutilizável
- **Context API**: Gerenciamento de estado global
- **Service Layer**: Abstração das chamadas de API

## 🛠️ Tecnologias

### Backend
- **[NestJS](https://nestjs.com/)**: Framework Node.js para aplicações escaláveis
- **[TypeScript](https://www.typescriptlang.org/)**: Linguagem tipada
- **[Prisma](https://www.prisma.io/)**: ORM moderno para Node.js
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional
- **[JWT](https://jwt.io/)**: JSON Web Tokens
- **[Jest](https://jestjs.io/)**: Framework de testes

### Frontend
- **[React](https://reactjs.org/)**: Biblioteca JavaScript para interfaces
- **[TypeScript](https://www.typescriptlang.org/)**: Linguagem tipada
- **[Vite](https://vitejs.dev/)**: Build tool moderna
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utilitário
- **[React Router](https://reactrouter.com/)**: Roteamento
- **[Axios](https://axios-http.com/)**: Cliente HTTP

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **Yarn** >= 1.22.0
- **PostgreSQL** >= 14.0
- **Git**

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/SantiVinius/credifit.git
cd credifit
```

### 2. Configure o Backend (API)
```bash
cd api

# Instale as dependências
yarn install

# Configure as variáveis de ambiente
cp .env.example .env

# Configure o banco de dados
yarn prisma migrate dev
yarn prisma generate
```

### 3. Configure o Frontend
```bash
cd ../frontend

# Instale as dependências
yarn install
```

## ⚙️ Configuração

### Backend (.env)
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

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🎮 Uso

### Desenvolvimento

#### Backend
```bash
cd api
yarn start:dev
```

#### Frontend
```bash
cd frontend
yarn dev
```

### Produção

#### Backend
```bash
cd api
yarn build
yarn start:prod
```

#### Frontend
```bash
cd frontend
yarn build
yarn preview
```

### Scripts Disponíveis

#### Backend
| Comando | Descrição |
|---------|-----------|
| `yarn start:dev` | Modo desenvolvimento |
| `yarn start:prod` | Modo produção |
| `yarn test` | Executa testes |
| `yarn lint` | Executa o linter |

#### Frontend
| Comando | Descrição |
|---------|-----------|
| `yarn dev` | Servidor de desenvolvimento |
| `yarn build` | Build para produção |
| `yarn preview` | Preview da build |
| `yarn lint` | Executa o linter |

## 📚 Documentação da API

A documentação completa da API está disponível em:
- **Swagger UI**: `http://localhost:3000/api`
- **README da API**: [api/README.md](api/README.md)

### Endpoints Principais

#### 🔐 Autenticação
- `POST /auth/signin` - Login de funcionário
- `POST /auth/signup` - Cadastro de funcionário

#### 🏢 Empresas
- `POST /empresas` - Cadastrar empresa
- `GET /empresas` - Listar empresas
- `GET /empresas/:id` - Buscar empresa

#### 👥 Funcionários
- `POST /funcionarios` - Cadastrar funcionário
- `GET /funcionarios` - Listar funcionários
- `GET /funcionarios/:id` - Buscar funcionário

#### 💰 Empréstimos
- `POST /emprestimos/simulacao` - Simular empréstimo
- `POST /emprestimos` - Criar empréstimo
- `GET /emprestimos` - Listar empréstimos do usuário

## 🧪 Testes

### Backend
```bash
cd api
yarn test              # Testes unitários
yarn test:cov          # Testes com cobertura
yarn test:e2e          # Testes end-to-end
```

### Frontend
```bash
cd frontend
yarn test              # Testes unitários
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Vínius Santi** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/SantiVinius)

## 🙏 Agradecimentos

- [NestJS](https://nestjs.com/) - Framework incrível para backend
- [React](https://reactjs.org/) - Biblioteca para interfaces
- [Prisma](https://www.prisma.io/) - ORM moderno
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Vite](https://vitejs.dev/) - Build tool moderna 
