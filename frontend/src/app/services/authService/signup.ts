import { httpClient } from "../httpClient";

interface SignupParams {
  nome: string;
  cpf: string;
  email: string;
  password: string;
  salario: number;
  idEmpresa: string;
}

interface SignupResponse {
  accessToken: string;
}

export async function signup(params: SignupParams) {
  const { data } = await httpClient.post<SignupResponse>(
    "/auth/signup",
    params
  );

  return data;
}
