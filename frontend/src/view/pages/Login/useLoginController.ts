import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "../../../app/services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

const schema = z.object({
  email: z
    .string()
    .nonempty("Email é obrigatório")
    .email("Informe um email válido"),
  password: z
    .string()
    .nonempty("Senha é obrigatória")
    .min(6, "Senha deve conter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function useLoginController() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  const {
    handleSubmit: hookFormHandleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    setIsLoading(true);
    
    try {
      const response = await authService.signin(data);
      console.log('Resposta do login:', response);
      console.log('Tipo da resposta:', typeof response);
      console.log('Chaves da resposta:', Object.keys(response));
      
      // Como o endpoint tem @SkipResponseInterceptor, a resposta vem diretamente
      const accessToken = response.accessToken;
      
      if (!accessToken) {
        console.error('Estrutura da resposta:', response);
        throw new Error("Token não encontrado na resposta");
      }
      
      localStorage.setItem("token", accessToken);
      
      // Buscar dados do usuário após o login
      await fetchUser();
      
      setShowSuccessToast(true);
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Email ou senha incorretos. Tente novamente.";
      setErrorMessage(errorMsg);
      setShowErrorToast(true);
    } finally {
      setIsLoading(false);
    }
  });

  return { 
    handleSubmit, 
    register, 
    errors, 
    isLoading,
    showSuccessToast,
    showErrorToast,
    errorMessage,
    setShowSuccessToast,
    setShowErrorToast
  };
}
