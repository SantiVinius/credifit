import { STATUS_EMPRESTIMO, FAIXAS_SALARIO } from './constants';

describe('Constants', () => {
  describe('STATUS_EMPRESTIMO', () => {
    it('should have correct status values', () => {
      expect(STATUS_EMPRESTIMO.APROVADO).toBe('APROVADO');
      expect(STATUS_EMPRESTIMO.REPROVADO).toBe('REJEITADO');
    });

    it('should have only two status options', () => {
      const statusKeys = Object.keys(STATUS_EMPRESTIMO);
      expect(statusKeys).toHaveLength(2);
      expect(statusKeys).toContain('APROVADO');
      expect(statusKeys).toContain('REPROVADO');
    });
  });

  describe('FAIXAS_SALARIO', () => {
    it('should have correct salary ranges', () => {
      expect(FAIXAS_SALARIO).toHaveLength(4);
      
      expect(FAIXAS_SALARIO[0]).toEqual({ limite: 2000, score: 400 });
      expect(FAIXAS_SALARIO[1]).toEqual({ limite: 4000, score: 500 });
      expect(FAIXAS_SALARIO[2]).toEqual({ limite: 8000, score: 600 });
      expect(FAIXAS_SALARIO[3]).toEqual({ limite: 12000, score: 700 });
    });

    it('should have ascending salary limits', () => {
      for (let i = 1; i < FAIXAS_SALARIO.length; i++) {
        expect(FAIXAS_SALARIO[i].limite).toBeGreaterThan(FAIXAS_SALARIO[i - 1].limite);
      }
    });

    it('should have ascending score requirements', () => {
      for (let i = 1; i < FAIXAS_SALARIO.length; i++) {
        expect(FAIXAS_SALARIO[i].score).toBeGreaterThan(FAIXAS_SALARIO[i - 1].score);
      }
    });

    it('should have positive values', () => {
      FAIXAS_SALARIO.forEach(faixa => {
        expect(faixa.limite).toBeGreaterThan(0);
        expect(faixa.score).toBeGreaterThan(0);
      });
    });

    it('should have reasonable score ranges', () => {
      FAIXAS_SALARIO.forEach(faixa => {
        expect(faixa.score).toBeGreaterThanOrEqual(400);
        expect(faixa.score).toBeLessThanOrEqual(700);
      });
    });
  });
}); 