import { httpClient } from "../httpClient";

interface Empresa {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeRepresentante: string;
  cpfRepresentante: string;
  emailRepresentante: string;
}

interface GetEmpresasResponse {
  success: boolean;
  data: Empresa[];
  message: string;
  timestamp: string;
}

export async function getEmpresas() {
  try {
    console.log("Buscando empresas...");
    const response = await httpClient.get<GetEmpresasResponse>("/empresas");
    console.log("Resposta completa:", response);
    console.log("Empresas encontradas:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    throw error;
  }
} 