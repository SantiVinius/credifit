import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { ValidateEmpresaService } from './validate-empresas.service';
import { EmpresaRepository } from '../../../shared/database/repositories/empresa.repository';

describe('ValidateEmpresaService', () => {
  let service: ValidateEmpresaService;
  let empresaRepository: jest.Mocked<EmpresaRepository>;

  const mockEmpresaRepository = {
    findUnique: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateEmpresaService,
        {
          provide: EmpresaRepository,
          useValue: mockEmpresaRepository,
        },
      ],
    }).compile();

    service = module.get<ValidateEmpresaService>(ValidateEmpresaService);
    empresaRepository = module.get(EmpresaRepository);
    
    // Reset mocks before each test
    mockEmpresaRepository.findUnique.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockEmpresaRepository.findUnique.mockReset();
  });

  describe('validate', () => {
    const validCNPJ = '11.222.333/0001-81';
    const validCPF = '123.456.789-09';
    const validEmail = 'test@example.com';

    it('should validate successfully with valid data', async () => {
      // Arrange
      empresaRepository.findUnique.mockResolvedValue(null); // No existing records

      // Act & Assert
      await expect(
        service.validate(validCNPJ, validCPF, validEmail)
      ).resolves.not.toThrow();
    });

    describe('CNPJ validation', () => {
      it('should throw BadRequestException for invalid CNPJ', async () => {
        // Arrange
        const invalidCNPJ = '11.111.111/1111-11';

        // Act & Assert
        await expect(
          service.validate(invalidCNPJ, validCPF, validEmail)
        ).rejects.toThrow(BadRequestException);
        await expect(
          service.validate(invalidCNPJ, validCPF, validEmail)
        ).rejects.toThrow('CNPJ inválido.');
      });

      it('should throw ConflictException for existing CNPJ', async () => {
        // Arrange
        empresaRepository.findUnique.mockResolvedValue({ id: 'existing-id' } as any);

        // Act & Assert
        await expect(
          service.validate(validCNPJ, validCPF, validEmail)
        ).rejects.toThrow(ConflictException);
        await expect(
          service.validate(validCNPJ, validCPF, validEmail)
        ).rejects.toThrow('CNPJ já cadastrado');
      });

      it('should check CNPJ uniqueness correctly', async () => {
        // Arrange
        empresaRepository.findUnique.mockResolvedValue(null);

        // Act
        await service.validate(validCNPJ, validCPF, validEmail);

        // Assert
        expect(empresaRepository.findUnique).toHaveBeenCalledWith({
          where: { cnpj: '11222333000181' }, // Normalized CNPJ
        });
      });
    });

    describe('CPF validation', () => {
      it('should throw BadRequestException for invalid CPF', async () => {
        // Arrange
        const invalidCPF = '111.111.111-11';

        // Act & Assert
        await expect(
          service.validate(validCNPJ, invalidCPF, validEmail)
        ).rejects.toThrow(BadRequestException);
        await expect(
          service.validate(validCNPJ, invalidCPF, validEmail)
        ).rejects.toThrow('CPF do representante inválido.');
      });

      it('should check CPF uniqueness correctly', async () => {
        // Arrange
        empresaRepository.findUnique.mockResolvedValue(null);

        // Act
        await service.validate(validCNPJ, validCPF, validEmail);

        // Assert
        expect(empresaRepository.findUnique).toHaveBeenCalledWith({
          where: { cpfRepresentante: '12345678909' }, // Normalized CPF
        });
      });
    });

    describe('Email validation', () => {
      it('should normalize email to lowercase', async () => {
        // Arrange
        const emailWithCaps = 'TEST@EXAMPLE.COM';
        empresaRepository.findUnique.mockResolvedValue(null);

        // Act
        await service.validate(validCNPJ, validCPF, emailWithCaps);

        // Assert
        expect(empresaRepository.findUnique).toHaveBeenCalledWith({
          where: { emailRepresentante: 'test@example.com' }, // Lowercase email
        });
      });

      it('should check email uniqueness correctly', async () => {
        // Arrange
        empresaRepository.findUnique.mockResolvedValue(null);

        // Act
        await service.validate(validCNPJ, validCPF, validEmail);

        // Assert
        expect(empresaRepository.findUnique).toHaveBeenCalledWith({
          where: { emailRepresentante: 'test@example.com' },
        });
      });
    });

    describe('Repository calls order', () => {
      it('should call repository methods in correct order', async () => {
        // Arrange
        empresaRepository.findUnique.mockResolvedValue(null);

        // Act
        await service.validate(validCNPJ, validCPF, validEmail);

        // Assert
        expect(empresaRepository.findUnique).toHaveBeenCalledTimes(3);
        expect(empresaRepository.findUnique).toHaveBeenNthCalledWith(1, {
          where: { cnpj: '11222333000181' },
        });
        expect(empresaRepository.findUnique).toHaveBeenNthCalledWith(2, {
          where: { cpfRepresentante: '12345678909' },
        });
        expect(empresaRepository.findUnique).toHaveBeenNthCalledWith(3, {
          where: { emailRepresentante: 'test@example.com' },
        });
      });
    });
  });
}); 