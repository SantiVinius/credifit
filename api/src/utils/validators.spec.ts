import {
  isValidCPF,
  isValidCNPJ,
  normalizeCPF,
  normalizeCNPJ,
  isValidEmail,
} from './validators';

describe('Validators', () => {
  describe('CPF Validation', () => {
    describe('isValidCPF', () => {
      it('should validate correct CPF with dots and dash', () => {
        expect(isValidCPF('123.456.789-09')).toBe(true);
      });

      it('should validate correct CPF without formatting', () => {
        expect(isValidCPF('12345678909')).toBe(true);
      });

      it('should reject CPF with all same digits', () => {
        expect(isValidCPF('111.111.111-11')).toBe(false);
        expect(isValidCPF('222.222.222-22')).toBe(false);
        expect(isValidCPF('333.333.333-33')).toBe(false);
      });

      it('should reject CPF with wrong length', () => {
        expect(isValidCPF('123.456.789-0')).toBe(false); // 10 digits
        expect(isValidCPF('123.456.789-012')).toBe(false); // 12 digits
      });

      it('should reject CPF with invalid check digits', () => {
        expect(isValidCPF('123.456.789-10')).toBe(false);
        expect(isValidCPF('123.456.789-11')).toBe(false);
      });

      it('should reject empty or null CPF', () => {
        expect(isValidCPF('')).toBe(false);
        expect(isValidCPF(null as any)).toBe(false);
        expect(isValidCPF(undefined as any)).toBe(false);
      });

      it('should reject CPF with invalid characters', () => {
        expect(isValidCPF('123.456.789-0a')).toBe(false);
        expect(isValidCPF('abc.def.ghi-jk')).toBe(false);
      });
    });

    describe('normalizeCPF', () => {
      it('should remove dots and dash from CPF', () => {
        expect(normalizeCPF('123.456.789-09')).toBe('12345678909');
      });

      it('should return same string if no formatting', () => {
        expect(normalizeCPF('12345678909')).toBe('12345678909');
      });

      it('should remove all non-digit characters', () => {
        expect(normalizeCPF('123-456.789/09')).toBe('12345678909');
        expect(normalizeCPF('123 456 789 09')).toBe('12345678909');
      });
    });
  });

  describe('CNPJ Validation', () => {
    describe('isValidCNPJ', () => {
      it('should validate correct CNPJ with formatting', () => {
        expect(isValidCNPJ('11.222.333/0001-81')).toBe(true);
      });

      it('should validate correct CNPJ without formatting', () => {
        expect(isValidCNPJ('11222333000181')).toBe(true);
      });

      it('should reject CNPJ with all same digits', () => {
        expect(isValidCNPJ('11.111.111/1111-11')).toBe(false);
        expect(isValidCNPJ('22.222.222/2222-22')).toBe(false);
      });

      it('should reject CNPJ with wrong length', () => {
        expect(isValidCNPJ('11.222.333/0001-4')).toBe(false); // 13 digits
        expect(isValidCNPJ('11.222.333/0001-444')).toBe(false); // 15 digits
      });

      it('should reject CNPJ with invalid check digits', () => {
        expect(isValidCNPJ('11.222.333/0001-45')).toBe(false);
        expect(isValidCNPJ('11.222.333/0001-46')).toBe(false);
      });

      it('should reject empty or null CNPJ', () => {
        expect(isValidCNPJ('')).toBe(false);
        expect(isValidCNPJ(null as any)).toBe(false);
        expect(isValidCNPJ(undefined as any)).toBe(false);
      });

      it('should reject CNPJ with invalid characters', () => {
        expect(isValidCNPJ('11.222.333/0001-4a')).toBe(false);
        expect(isValidCNPJ('ab.cde.fgh/ijkl-mn')).toBe(false);
      });
    });

    describe('normalizeCNPJ', () => {
      it('should remove dots, slash and dash from CNPJ', () => {
        expect(normalizeCNPJ('11.222.333/0001-44')).toBe('11222333000144');
      });

      it('should return same string if no formatting', () => {
        expect(normalizeCNPJ('11222333000144')).toBe('11222333000144');
      });

      it('should remove all non-digit characters', () => {
        expect(normalizeCNPJ('11-222.333/0001 44')).toBe('11222333000144');
        expect(normalizeCNPJ('11 222 333 0001 44')).toBe('11222333000144');
      });
    });
  });

  describe('Email Validation', () => {
    describe('isValidEmail', () => {
      it('should validate correct email addresses', () => {
        expect(isValidEmail('user@example.com')).toBe(true);
        expect(isValidEmail('user.name@example.com')).toBe(true);
        expect(isValidEmail('user@example.co.uk')).toBe(true);
      });

      it('should reject invalid email addresses', () => {
        expect(isValidEmail('user@')).toBe(false);
        expect(isValidEmail('@example.com')).toBe(false);
        expect(isValidEmail('user@.com')).toBe(false);
        expect(isValidEmail('user.example.com')).toBe(false);
        expect(isValidEmail('user@example')).toBe(false);
      });

      it('should reject empty or null email', () => {
        expect(isValidEmail('')).toBe(false);
        expect(isValidEmail(null as any)).toBe(false);
        expect(isValidEmail(undefined as any)).toBe(false);
      });

      it('should reject email with invalid characters', () => {
        expect(isValidEmail('user<@example.com')).toBe(false);
        expect(isValidEmail('user>@example.com')).toBe(false);
        expect(isValidEmail('user[@example.com')).toBe(false);
      });
    });
  });
}); 