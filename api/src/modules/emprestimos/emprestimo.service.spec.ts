import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import axios from 'axios';
import { EmprestimoService } from './emprestimo.service';
import { FuncionarioRepository } from '../../shared/database/repositories/funcionario.repository';
import { EmprestimoRepository } from '../../shared/database/repositories/emprestimo.repository';
import { ParcelasRepository } from '../../shared/database/repositories/parcelas.repository';
import { STATUS_EMPRESTIMO, FAIXAS_SALARIO } from '../../utils/constants';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EmprestimoService', () => {
  let service: EmprestimoService;
  let funcionarioRepository: jest.Mocked<FuncionarioRepository>;
  let emprestimoRepository: jest.Mocked<EmprestimoRepository>;
  let parcelaRepository: jest.Mocked<ParcelasRepository>;

  const mockFuncionarioRepository = {
    findUnique: jest.fn(),
  };

  const mockEmprestimoRepository = {
    findMany: jest.fn(),
    create: jest.fn(),
  };

  const mockParcelaRepository = {
    create: jest.fn(),
  };

  const mockFuncionario = {
    id: 'funcionario-id',
    nome: 'João Silva',
    cpf: '123.456.789-09',
    email: 'joao@example.com',
    senha: 'hashedPassword',
    salario: 5000,
    idEmpresa: 'empresa-id',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmprestimoService,
        {
          provide: FuncionarioRepository,
          useValue: mockFuncionarioRepository,
        },
        {
          provide: EmprestimoRepository,
          useValue: mockEmprestimoRepository,
        },
        {
          provide: ParcelasRepository,
          useValue: mockParcelaRepository,
        },
      ],
    }).compile();

    service = module.get<EmprestimoService>(EmprestimoService);
    funcionarioRepository = module.get(FuncionarioRepository);
    emprestimoRepository = module.get(EmprestimoRepository);
    parcelaRepository = module.get(ParcelasRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all loans for a user', async () => {
      // Arrange
      const userId = 'funcionario-id';
      const mockEmprestimos = [
        {
          id: 'emprestimo-1',
          idFuncionario: 'funcionario-id',
          valorSolicitado: 1000,
          quantidadeParcelas: 2,
          dataSolicitacao: new Date(),
          statusAprovacao: STATUS_EMPRESTIMO.APROVADO,
          motivoRejeicao: null,
          scoreUtilizado: 650,
          funcionario: mockFuncionario,
          parcelas: [],
        },
      ];

      emprestimoRepository.findMany.mockResolvedValue(mockEmprestimos as any);

      // Act
      const result = await service.findAll(userId);

      // Assert
      expect(result).toEqual(mockEmprestimos);
      expect(emprestimoRepository.findMany).toHaveBeenCalledWith({
        where: { idFuncionario: userId },
        include: {
          funcionario: {
            include: {
              empresa: {
                select: {
                  nomeRepresentante: true,
                  razaoSocial: true,
                  cnpj: true,
                },
              },
            },
          },
          parcelas: {
            select: {
              numeroParcela: true,
              valor: true,
              dataVencimento: true,
            },
          },
        },
      });
    });
  });

  describe('simular', () => {
    const simulateData = { valorSolicitado: 1000 };

    it('should simulate loan successfully', async () => {
      // Arrange
      funcionarioRepository.findUnique.mockResolvedValue(mockFuncionario);

      // Act
      const result = await service.simular(simulateData, 'funcionario-id');

      // Assert
      expect(result).toEqual({
        valorSolicitado: 1000,
        margemCredito: 1750, // 35% de 5000
        opcoesParcelamento: [
          { parcelas: 1, valorParcela: 1000 },
          { parcelas: 2, valorParcela: 500 },
          { parcelas: 3, valorParcela: 333.33 },
          { parcelas: 4, valorParcela: 250 },
        ],
      });
    });

    it('should throw BadRequestException when funcionario not found', async () => {
      // Arrange
      funcionarioRepository.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.simular(simulateData, 'invalid-id')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.simular(simulateData, 'invalid-id')).rejects.toThrow(
        'Funcionário não encontrado',
      );
    });

    it('should throw BadRequestException when value exceeds credit margin', async () => {
      // Arrange
      funcionarioRepository.findUnique.mockResolvedValue(mockFuncionario);
      const highValueData = { valorSolicitado: 2000 }; // Exceeds 35% of 5000

      // Act & Assert
      await expect(
        service.simular(highValueData, 'funcionario-id'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.simular(highValueData, 'funcionario-id'),
      ).rejects.toThrow(
        'Valor solicitado (R$ 2000.00) excede a margem de crédito disponível (R$ 1750.00)',
      );
    });
  });

  describe('create', () => {
    const createData = { valorSolicitado: 1000, quantidadeParcelas: 2 };

    it('should create loan successfully when approved', async () => {
      // Arrange
      funcionarioRepository.findUnique.mockResolvedValue(mockFuncionario);
      mockedAxios.get.mockResolvedValueOnce({ data: { score: 650 } });
      mockedAxios.get.mockResolvedValueOnce({ data: { status: 'aprovado' } });

      const mockEmprestimo = {
        id: 'emprestimo-id',
        idFuncionario: 'funcionario-id',
        valorSolicitado: 1000,
        quantidadeParcelas: 2,
        dataSolicitacao: new Date(),
        statusAprovacao: STATUS_EMPRESTIMO.APROVADO,
        motivoRejeicao: null,
        scoreUtilizado: 650,
      };

      emprestimoRepository.create.mockResolvedValue(mockEmprestimo as any);
      parcelaRepository.create.mockResolvedValue({} as any);

      // Act
      const result = await service.create(createData, 'funcionario-id');

      // Assert
      expect(result).toEqual(mockEmprestimo);
      expect(emprestimoRepository.create).toHaveBeenCalledWith({
        data: {
          valorSolicitado: 1000,
          quantidadeParcelas: 2,
          idFuncionario: 'funcionario-id',
          scoreUtilizado: 650,
          statusAprovacao: STATUS_EMPRESTIMO.APROVADO,
        },
      });
      expect(parcelaRepository.create).toHaveBeenCalledTimes(2);
    });

    it('should create loan with rejected status when score is insufficient', async () => {
      // Arrange
      funcionarioRepository.findUnique.mockResolvedValue(mockFuncionario);
      mockedAxios.get.mockResolvedValueOnce({ data: { score: 300 } }); // Low score

      const mockEmprestimo = {
        id: 'emprestimo-id',
        idFuncionario: 'funcionario-id',
        valorSolicitado: 1000,
        quantidadeParcelas: 2,
        dataSolicitacao: new Date(),
        statusAprovacao: STATUS_EMPRESTIMO.REPROVADO,
        motivoRejeicao: null,
        scoreUtilizado: 300,
      };

      emprestimoRepository.create.mockResolvedValue(mockEmprestimo as any);

      // Act
      const result = await service.create(createData, 'funcionario-id');

      // Assert
      expect(result).toEqual(mockEmprestimo);
      expect(result.statusAprovacao).toBe(STATUS_EMPRESTIMO.REPROVADO);
      expect(parcelaRepository.create).not.toHaveBeenCalled(); // No parcels for rejected loans
    });

    it('should throw ConflictException when value exceeds credit margin', async () => {
      // Arrange
      funcionarioRepository.findUnique.mockResolvedValue(mockFuncionario);
      const highValueData = { valorSolicitado: 2000, quantidadeParcelas: 2 };

      // Act & Assert
      await expect(
        service.create(highValueData, 'funcionario-id'),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.create(highValueData, 'funcionario-id'),
      ).rejects.toThrow('Empréstimo solicitado excede a margem de crédito.');
    });

    it('should handle API timeout gracefully', async () => {
      // Arrange
      funcionarioRepository.findUnique.mockResolvedValue(mockFuncionario);
      mockedAxios.get.mockRejectedValueOnce(new Error('Timeout'));

      const mockEmprestimo = {
        id: 'emprestimo-id',
        idFuncionario: 'funcionario-id',
        valorSolicitado: 1000,
        quantidadeParcelas: 2,
        dataSolicitacao: new Date(),
        statusAprovacao: STATUS_EMPRESTIMO.APROVADO,
        motivoRejeicao: null,
        scoreUtilizado: 500, // Fallback score
      };

      emprestimoRepository.create.mockResolvedValue(mockEmprestimo as any);

      // Act
      const result = await service.create(createData, 'funcionario-id');

      // Assert
      expect(result).toEqual(mockEmprestimo);
      expect(result.scoreUtilizado).toBe(500); // Should use fallback score
    });
  });

  describe('gerarParcelas', () => {
    it('should generate correct number of parcels', async () => {
      // Arrange
      const idEmprestimo = 'emprestimo-id';
      const valorSolicitado = 1000;
      const quantidadeParcelas = 3;

      parcelaRepository.create.mockResolvedValue({} as any);

      // Act
      await service.gerarParcelas(
        idEmprestimo,
        valorSolicitado,
        quantidadeParcelas,
      );

      // Assert
      expect(parcelaRepository.create).toHaveBeenCalledTimes(3);
      expect(parcelaRepository.create).toHaveBeenCalledWith({
        data: {
          idEmprestimo: 'emprestimo-id',
          numeroParcela: 1,
          valor: 333.3333333333333,
          dataVencimento: expect.any(Date),
        },
      });
    });

    it('should calculate correct parcel values', async () => {
      // Arrange
      const idEmprestimo = 'emprestimo-id';
      const valorSolicitado = 1000;
      const quantidadeParcelas = 2;

      parcelaRepository.create.mockResolvedValue({} as any);

      // Act
      await service.gerarParcelas(
        idEmprestimo,
        valorSolicitado,
        quantidadeParcelas,
      );

      // Assert
      expect(parcelaRepository.create).toHaveBeenCalledWith({
        data: {
          idEmprestimo: 'emprestimo-id',
          numeroParcela: 1,
          valor: 500,
          dataVencimento: expect.any(Date),
        },
      });
      expect(parcelaRepository.create).toHaveBeenCalledWith({
        data: {
          idEmprestimo: 'emprestimo-id',
          numeroParcela: 2,
          valor: 500,
          dataVencimento: expect.any(Date),
        },
      });
    });
  });

  describe('consultarScore', () => {
    it('should return score from API successfully', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({ data: { score: 650 } });

      // Act
      const result = await service.consultarScore('funcionario-id');

      // Assert
      expect(result).toBe(650);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf',
        { timeout: 5000 },
      );
    });

    it('should return fallback score when API fails', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
      funcionarioRepository.findUnique.mockResolvedValue(mockFuncionario);

      // Act
      const result = await service.consultarScore('funcionario-id');

      // Assert
      expect(result).toBe(600); // Score for salary <= 4000
    });

    it('should return fallback score when funcionario not found', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
      funcionarioRepository.findUnique.mockResolvedValue(null);

      // Act
      const result = await service.consultarScore('funcionario-id');

      // Assert
      expect(result).toBe(400); // Default score
    });
  });

  describe('simularPagamento', () => {
    it('should simulate payment successfully', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({ data: { status: 'aprovado' } });

      // Act & Assert
      await expect(
        service.simularPagamento('emprestimo-id', 'funcionario-id'),
      ).resolves.not.toThrow();
    });

    it('should throw ConflictException when payment is not approved', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValue({ data: { status: 'rejeitado' } });

      // Act & Assert
      await expect(
        service.simularPagamento('emprestimo-id', 'funcionario-id'),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.simularPagamento('emprestimo-id', 'funcionario-id'),
      ).rejects.toThrow('Pagamento do empréstimo não aprovado');
    });

    it('should handle API timeout gracefully', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValueOnce(new Error('Timeout'));

      // Act & Assert
      await expect(
        service.simularPagamento('emprestimo-id', 'funcionario-id'),
      ).resolves.not.toThrow(); // Should not throw, just log error
    });
  });

  describe('calcularParcelas', () => {
    it('should calculate parcel options correctly', () => {
      // Act
      const result = service['calcularParcelas'](1000);

      // Assert
      expect(result).toEqual([
        { parcelas: 1, valorParcela: 1000 },
        { parcelas: 2, valorParcela: 500 },
        { parcelas: 3, valorParcela: 333.33 },
        { parcelas: 4, valorParcela: 250 },
      ]);
    });

    it('should handle decimal values correctly', () => {
      // Act
      const result = service['calcularParcelas'](100);

      // Assert
      expect(result).toEqual([
        { parcelas: 1, valorParcela: 100 },
        { parcelas: 2, valorParcela: 50 },
        { parcelas: 3, valorParcela: 33.33 },
        { parcelas: 4, valorParcela: 25 },
      ]);
    });
  });

  describe('validarScore', () => {
    it('should return correct score for salary ranges', () => {
      // Act & Assert
      expect(service['validarScore'](1500)).toBe(400); // <= 2000
      expect(service['validarScore'](3000)).toBe(500); // <= 4000
      expect(service['validarScore'](6000)).toBe(600); // <= 8000
      expect(service['validarScore'](10000)).toBe(700); // <= 12000
      expect(service['validarScore'](15000)).toBe(700); // > 12000
    });
  });
});
