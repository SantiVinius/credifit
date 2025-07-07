import { httpClient } from "../httpClient";

interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  salario: number;
  idEmpresa: string;
  empresa: {
    id: string;
    razaoSocial: string;
  };
}

export async function getCurrentUser(): Promise<User> {
  const response = await httpClient.get<User>("/auth/me");
  return response.data;
} 