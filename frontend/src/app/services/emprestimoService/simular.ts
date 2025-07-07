import { httpClient } from "../httpClient";

interface SimularEmprestimoData {
  valorSolicitado: number;
}

interface OpcaoParcelamento {
  parcelas: number;
  valorParcela: number;
}

interface SimulacaoResponse {
  valorSolicitado: number;
  margemCredito: number;
  opcoesParcelamento: OpcaoParcelamento[];
}

export async function simularEmprestimo(data: SimularEmprestimoData): Promise<SimulacaoResponse> {
  console.log('Enviando dados para simulação:', data);
  console.log('Tipo do valorSolicitado:', typeof data.valorSolicitado);
  
  const response = await httpClient.post('/emprestimos/simulacao', data);
  return response.data;
} 