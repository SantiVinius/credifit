import { httpClient } from "../httpClient";

interface Parcela {
  numeroParcela: number;
  valor: number;
  dataVencimento: string;
}

interface Empresa {
  nomeRepresentante: string;
  razaoSocial: string;
  cnpj: string;
}

interface Funcionario {
  nome: string;
  email: string;
  empresa: Empresa;
}

interface Emprestimo {
  id: string;
  valorSolicitado: number;
  quantidadeParcelas: number;
  scoreUtilizado: number;
  statusAprovacao: string;
  dataSolicitacao: string;
  createdAt?: string;
  funcionario: Funcionario;
  parcelas: Parcela[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export async function buscarEmprestimos(): Promise<Emprestimo[]> {
  const response = await httpClient.get<ApiResponse<Emprestimo[]>>('/emprestimos');
  return response.data.data; // Acessa o campo 'data' dentro da resposta
} 