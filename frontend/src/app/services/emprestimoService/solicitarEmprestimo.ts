import { httpClient } from "../httpClient";

interface SolicitarEmprestimoData {
  valorSolicitado: number;
  quantidadeParcelas: number;
}

interface EmprestimoResponse {
  id: string;
  valorSolicitado: number;
  quantidadeParcelas: number;
  statusAprovacao: string;
  scoreUtilizado: number;
  createdAt: string;
}

export async function solicitarEmprestimo(data: SolicitarEmprestimoData): Promise<EmprestimoResponse> {
  console.log('Solicitando empréstimo:', data);
  
  const response = await httpClient.post('/emprestimos', data);
  return response.data;
} 