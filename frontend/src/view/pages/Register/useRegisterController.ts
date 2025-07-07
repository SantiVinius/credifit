import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authService } from "../../../app/services/authService";
import { empresaService } from "../../../app/services/empresaService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

const schema = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  cpf: z.string().nonempty("CPF é obrigatório"),
  email: z
    .string()
    .nonempty("Email é obrigatório")
    .email("Informe um email válido"),
  password: z
    .string()
    .nonempty("Senha é obrigatória")
    .min(6, "Senha deve conter pelo menos 6 caracteres"),
  salario: z
    .number()
    .min(0, "Salário deve ser maior que zero"),
  idEmpresa: z.string().uuid("Selecione uma empresa válida"),
});

type FormData = z.infer<typeof schema>;

interface Empresa {
  id: string;
  razaoSocial: string;
}

export function useRegisterController() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  const {
    handleSubmit: hookFormSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    async function loadEmpresas() {
      try {
        console.log("Carregando empresas no controller...");
        const response = await empresaService.getEmpresas();
        console.log("Resposta do serviço:", response);
        setEmpresas(response.data);
        console.log("Empresas definidas no estado:", response.data);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      }
    }

    loadEmpresas();
  }, []);

  const handleSubmit = hookFormSubmit(async (data) => {
    setIsLoading(true);
    try {
      const { accessToken } = await authService.signup(data);
      
      // Salvar token no localStorage
      localStorage.setItem("token", accessToken);
      
      // Buscar dados do usuário após o registro
      await fetchUser();
      
      console.log("Cadastro realizado com sucesso:", accessToken);
      
      // Mostrar notificação de sucesso
      setShowSuccessToast(true);
      
      // Redirecionar para home após 1 segundo
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErrorMessage("Erro ao criar conta. Tente novamente.");
      setShowErrorToast(true);
    } finally {
      setIsLoading(false);
    }
  });

  return { 
    register, 
    errors, 
    handleSubmit, 
    empresas,
    isLoading,
    showSuccessToast,
    showErrorToast,
    errorMessage,
    setShowSuccessToast,
    setShowErrorToast
  };
}
