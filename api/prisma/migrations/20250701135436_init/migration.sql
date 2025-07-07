-- CreateEnum
CREATE TYPE "status_aprovacao" AS ENUM ('APROVADO', 'REJEITADO');

-- CreateTable
CREATE TABLE "empresas" (
    "id" UUID NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_representante" TEXT NOT NULL,
    "cpf_representante" TEXT NOT NULL,
    "email_representante" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" UUID NOT NULL,
    "id_empresa" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "salario" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emprestimos" (
    "id" UUID NOT NULL,
    "id_funcionario" UUID NOT NULL,
    "valor_solicitado" DOUBLE PRECISION NOT NULL,
    "quantidade_parcelas" INTEGER NOT NULL,
    "data_solicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_aprovacao" "status_aprovacao" NOT NULL,
    "motivo_rejeicao" TEXT,
    "score_utilizado" INTEGER NOT NULL,

    CONSTRAINT "emprestimos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcelas" (
    "id" UUID NOT NULL,
    "idEmprestimo" UUID NOT NULL,
    "numero_parcela" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parcelas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cpf_representante_key" ON "empresas"("cpf_representante");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_email_representante_key" ON "empresas"("email_representante");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_cpf_key" ON "funcionarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_email_key" ON "funcionarios"("email");

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcelas" ADD CONSTRAINT "parcelas_idEmprestimo_fkey" FOREIGN KEY ("idEmprestimo") REFERENCES "emprestimos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
