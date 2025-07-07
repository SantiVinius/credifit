import { httpClient } from "../httpClient";

interface SigninParams {
  email: string;
  password: string;
}

interface SigninResponse {
  accessToken: string;
}

export async function signin(params: SigninParams) {
  const response = await httpClient.post<SigninResponse>("/auth/signin", params);
  return response.data;
} 