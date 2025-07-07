import { Link } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";
import { useLoginController } from "./useLoginController";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../../components/ErrorAlert";

export function Login() {
  const { 
    handleSubmit, 
    register, 
    errors, 
    isLoading,
    showSuccessToast,
    showErrorToast,
    errorMessage,
    setShowSuccessToast,
    setShowErrorToast
  } = useLoginController();

  return (
    <>
      <header className="flex flex-col items-center gap-4 text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-[-1px]">
          Entre em sua conta
        </h1>

        <p className="space-x-2">
          <span className="text-gray-700 tracking-[-0.5px]">
            Novo por aqui?
          </span>

          <Link
            to="/register"
            className="tracking-[-0.5px] font-medium text-teal-900"
          >
            Crie uma conta
          </Link>
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          type="password"
          placeholder="Senha"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" className="mt-4" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      {/* Toast de Sucesso */}
      <Toast
        message="Login realizado com sucesso! Redirecionando..."
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
