// Utilitário para formatação de moeda e data

export function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(valor);
}

export function formatarData(data: string) {
  if (!data) return 'Data não disponível';
  let date = new Date(data);
  if (isNaN(date.getTime()) && typeof data === 'string') {
    date = new Date(data.replace(/-/g, '/'));
  }
  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }
  return date.toLocaleDateString('pt-BR');
} 