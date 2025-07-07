import { Link } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { Toast } from "../../components/Toast";
import { useRegisterController } from "./useRegisterController";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { empresaService } from "../../../app/services/empresaService";
import { ErrorAlert } from "../../../components/ErrorAlert";
import { formatarMoeda } from "../../../app/utils/format";

export function Register() {
  const { 
    register, 
    handleSubmit, 
    errors, 
    empresas, 
    isLoading,
    showSuccessToast,
    showErrorToast,
    errorMessage,
    setShowSuccessToast,
    setShowErrorToast
  } = useRegisterController();

  const empresaOptions = empresas.map((empresa) => ({
    value: empresa.id,
    label: empresa.razaoSocial,
  }));

  return (
    <>
      <header className="flex flex-col items-center gap-4 text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-[-1px]">
          Crie sua conta
        </h1>

        <p className="space-x-2">
          <span className="text-gray-700 tracking-[-0.5px]">
            Já possui uma conta?
          </span>

          <Link
            to="/login"
            className="tracking-[-0.5px] font-medium text-teal-900"
          >
            Fazer login
          </Link>
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Nome completo"
          error={errors.nome?.message}
          {...register("nome")}
        />

        <Input
          type="text"
          placeholder="CPF"
          error={errors.cpf?.message}
          {...register("cpf")}
        />

        <Input
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          type="number"
          placeholder="Salário"
          error={errors.salario?.message}
          {...register("salario", { valueAsNumber: true })}
        />

        <Select
          error={errors.idEmpresa?.message}
          options={empresaOptions}
          {...register("idEmpresa")}
        />

        <Input
          type="password"
          placeholder="Senha"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" className="mt-4" disabled={isLoading}>
          {isLoading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      {/* Toast de Sucesso */}
      <Toast
        message="Conta criada com sucesso! Redirecionando..."
        type="success"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Toast de Erro */}
      <Toast
        message={errorMessage}
        type="error"
        isVisible={showErrorToast}
        onClose={() => setShowErrorToast(false)}
      />
    </>
  );
}
