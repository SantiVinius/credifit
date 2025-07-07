import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { ValidateFuncionarioService } from './validate-funcionarios.service';
import { FuncionarioRepository } from '../../../shared/database/repositories/funcionario.repository';
import { EmpresaRepository } from '../../../shared/database/repositories/empresa.repository';

describe('ValidateFuncionarioService', () => {
  let service: ValidateFuncionarioService;
  let funcionarioRepository: jest.Mocked<FuncionarioRepository>;
  let empresaRepository: jest.Mocked<EmpresaRepository>;

  const mockFuncionarioRepository = {
    findUnique: jest.fn(),
  };

  const mockEmpresaRepository = {
    findUnique: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateFuncionarioService,
        {
          provide: FuncionarioRepository,
          useValue: mockFuncionarioRepository,
        },
        {
          provide: EmpresaRepository,
          useValue: mockEmpresaRepository,
        },
      ],
    }).compile();

    service = module.get<ValidateFuncionarioService>(
      ValidateFuncionarioService,
    );
    funcionarioRepository = module.get(FuncionarioRepository);
    empresaRepository = module.get(EmpresaRepository);
    
    // Reset mocks before each test
    mockFuncionarioRepository.findUnique.mockReset();
    mockEmpresaRepository.findUnique.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockFuncionarioRepository.findUnique.mockReset();
    mockEmpresaRepository.findUnique.mockReset();
  });

  describe('validate', () => {
    const validCPF = '123.456.789-09';
    const validEmail = 'funcionario@example.com';
    const validEmpresaId = '123e4567-e89b-12d3-a456-426614174000';

    it('should validate successfully with valid data', async () => {
      // Arrange
      funcionarioRepository.findUnique.mockResolvedValue(null);
      empresaRepository.findUnique.mockResolvedValue({
        id: validEmpresaId,
      } as any);

      // Act & Assert
      await expect(
        service.validate(validCPF, validEmail, validEmpresaId),
      ).resolves.not.toThrow();
    });

    describe('CPF validation', () => {
      it('should throw BadRequestException for invalid CPF', async () => {
        // Arrange
        const invalidCPF = '111.111.111-11';

        // Act & Assert
        await expect(
          service.validate(invalidCPF, validEmail, validEmpresaId),
        ).rejects.toThrow(BadRequestException);
        await expect(
          service.validate(invalidCPF, validEmail, validEmpresaId),
        ).rejects.toThrow('CPF do funcionário inválido.');
      });

      it('should throw ConflictException for existing CPF', async () => {
        // Arrange
        funcionarioRepository.findUnique.mockResolvedValue({
          id: 'existing-id',
        } as any);

        // Act & Assert
        await expect(
          service.validate(validCPF, validEmail, validEmpresaId),
        ).rejects.toThrow(ConflictException);
        await expect(
          service.validate(validCPF, validEmail, validEmpresaId),
        ).rejects.toThrow('CPF já cadastrado');
      });

      it('should check CPF uniqueness correctly', async () => {
        // Arrange
        funcionarioRepository.findUnique.mockResolvedValue(null);
        empresaRepository.findUnique.mockResolvedValue({
          id: validEmpresaId,
        } as any);

        // Act
        await service.validate(validCPF, validEmail, validEmpresaId);

        // Assert
        expect(funcionarioRepository.findUnique).toHaveBeenCalledWith({
          where: { cpf: '12345678909' }, // Normalized CPF
        });
      });
    });

    describe('Email validation', () => {
      it('should normalize email to lowercase', async () => {
        // Arrange
        const emailWithCaps = 'FUNCIONARIO@EXAMPLE.COM';
        funcionarioRepository.findUnique.mockResolvedValue(null);
        empresaRepository.findUnique.mockResolvedValue({
          id: validEmpresaId,
        } as any);

        // Act
        await service.validate(validCPF, emailWithCaps, validEmpresaId);

        // Assert
        expect(funcionarioRepository.findUnique).toHaveBeenCalledWith({
          where: { email: 'funcionario@example.com' }, // Lowercase email
        });
      });

      it('should check email uniqueness correctly', async () => {
        // Arrange
        funcionarioRepository.findUnique.mockResolvedValue(null);
        empresaRepository.findUnique.mockResolvedValue({
          id: validEmpresaId,
        } as any);

        // Act
        await service.validate(validCPF, validEmail, validEmpresaId);

        // Assert
        expect(funcionarioRepository.findUnique).toHaveBeenCalledWith({
          where: { email: 'funcionario@example.com' },
        });
      });
    });

    describe('Empresa validation', () => {
      it('should throw BadRequestException for non-existent empresa', async () => {
        // Arrange
        funcionarioRepository.findUnique.mockResolvedValue(null);
        empresaRepository.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(
          service.validate(validCPF, validEmail, validEmpresaId),
        ).rejects.toThrow(BadRequestException);
        await expect(
          service.validate(validCPF, validEmail, validEmpresaId),
        ).rejects.toThrow('Empresa não encontrada');
      });

      it('should check empresa existence correctly', async () => {
        // Arrange
        funcionarioRepository.findUnique.mockResolvedValue(null);
        empresaRepository.findUnique.mockResolvedValue({
          id: validEmpresaId,
        } as any);

        // Act
        await service.validate(validCPF, validEmail, validEmpresaId);

        // Assert
        expect(empresaRepository.findUnique).toHaveBeenCalledWith({
          where: { id: validEmpresaId },
        });
      });
    });

    describe('Repository calls order', () => {
      it('should call repository methods in correct order', async () => {
        // Arrange
        funcionarioRepository.findUnique.mockResolvedValue(null);
        empresaRepository.findUnique.mockResolvedValue({
          id: validEmpresaId,
        } as any);

        // Act
        await service.validate(validCPF, validEmail, validEmpresaId);

        // Assert
        expect(funcionarioRepository.findUnique).toHaveBeenCalledTimes(2);
        expect(empresaRepository.findUnique).toHaveBeenCalledTimes(1);

        expect(funcionarioRepository.findUnique).toHaveBeenNthCalledWith(1, {
          where: { cpf: '12345678909' },
        });
        expect(funcionarioRepository.findUnique).toHaveBeenNthCalledWith(2, {
          where: { email: 'funcionario@example.com' },
        });
        expect(empresaRepository.findUnique).toHaveBeenCalledWith({
          where: { id: validEmpresaId },
        });
      });
    });

    describe('Error handling', () => {
      it('should stop validation on first error', async () => {
        // Arrange
        const invalidCPF = '111.111.111-11';

        // Act & Assert
        await expect(
          service.validate(invalidCPF, validEmail, validEmpresaId),
        ).rejects.toThrow(BadRequestException);

        // Should not call other validations
        expect(funcionarioRepository.findUnique).not.toHaveBeenCalled();
        expect(empresaRepository.findUnique).not.toHaveBeenCalled();
      });
    });
  });
});
