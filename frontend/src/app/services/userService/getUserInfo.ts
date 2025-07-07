import { httpClient } from "../httpClient";

interface UserInfo {
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

interface GetUserInfoResponse {
  data: UserInfo;
  timestamp: string;
  path: string;
}

export async function getUserInfo() {
  const response = await httpClient.get<GetUserInfoResponse>("/auth/me");
  return response.data;
} 