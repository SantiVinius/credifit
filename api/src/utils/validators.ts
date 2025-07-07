export function normalizeCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  return cnpj.replace(/[^\d]/g, '');
}

export function normalizeCPF(cpf: string): string {
  if (!cpf) return '';
  return cpf.replace(/[^\d]/g, '');
}

export function isValidCNPJ(cnpj: string): boolean {
  if (!cnpj) return false;
  // Remove formatação
  const cleanCNPJ = normalizeCNPJ(cnpj);

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  let weight = 2;

  // Primeiro dígito verificador
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  const remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(cleanCNPJ[12]) !== digit1) return false;

  // Segundo dígito verificador
  sum = 0;
  weight = 2;

  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  const remainder2 = sum % 11;
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;

  return parseInt(cleanCNPJ[13]) === digit2;
}

export function isValidCPF(cpf: string): boolean {
  if (!cpf) return false;
  // Remove formatação
  const cleanCPF = normalizeCPF(cpf);

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }

  const remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(cleanCPF[9]) !== digit1) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }

  const remainder2 = sum % 11;
  const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;

  return parseInt(cleanCPF[10]) === digit2;
}

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}
