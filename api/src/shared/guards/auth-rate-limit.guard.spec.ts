import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthRateLimitGuard } from './auth-rate-limit.guard';

describe('AuthRateLimitGuard', () => {
  let guard: AuthRateLimitGuard;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;

  beforeEach(() => {
    guard = new AuthRateLimitGuard();
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          ip: '192.168.1.1',
          connection: { remoteAddress: '192.168.1.1' },
        }),
      }),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow first authentication attempt', () => {
      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should allow attempts within limit', () => {
      // Arrange - Make 5 attempts (under the 10 limit)
      for (let i = 0; i < 5; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should block attempts after exceeding limit', () => {
      // Arrange - Make 10 attempts (at the limit)
      for (let i = 0; i < 10; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(HttpException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Too many authentication attempts. Please try again later.',
      );
    });

    it('should reset counter after window expires', () => {
      // Arrange - Make 10 attempts
      for (let i = 0; i < 10; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Act - Mock time passing (6 minutes = 6 * 60 * 1000 ms)
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => originalDateNow() + 6 * 60 * 1000);

      // Assert - Should allow attempt after window expires
      expect(() => guard.canActivate(mockExecutionContext)).not.toThrow();

      // Restore original Date.now
      Date.now = originalDateNow;
    });

    it('should handle different IP addresses separately', () => {
      // Arrange
      const mockExecutionContext2 = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            ip: '192.168.1.2',
            connection: { remoteAddress: '192.168.1.2' },
          }),
        }),
      } as any;

      // Act - Make 10 attempts from first IP
      for (let i = 0; i < 10; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Assert - Second IP should still be allowed
      expect(() => guard.canActivate(mockExecutionContext2)).not.toThrow();
    });

    it('should use connection.remoteAddress when ip is not available', () => {
      // Arrange
      const mockExecutionContextNoIP = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            connection: { remoteAddress: '192.168.1.3' },
          }),
        }),
      } as any;

      // Act
      const result = guard.canActivate(mockExecutionContextNoIP);

      // Assert
      expect(result).toBe(true);
    });

    it('should throw correct HTTP status code', () => {
      // Arrange - Make 10 attempts
      for (let i = 0; i < 10; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Act & Assert
      try {
        guard.canActivate(mockExecutionContext);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
        expect(error.message).toBe('Too many authentication attempts. Please try again later.');
      }
    });

    it('should have stricter limits than general rate limiting', () => {
      // Arrange - Make 10 attempts (auth limit)
      for (let i = 0; i < 10; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Act & Assert - Should be blocked at 10 attempts (vs 100 for general)
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(HttpException);
    });
  });

  describe('security features', () => {
    it('should prevent brute force attacks', () => {
      // Arrange - Simulate brute force attempt
      const attempts = Array.from({ length: 15 }, () => mockExecutionContext);

      // Act & Assert
      for (let i = 0; i < 10; i++) {
        expect(() => guard.canActivate(attempts[i])).not.toThrow();
      }

      // Should be blocked after 10 attempts
      for (let i = 10; i < 15; i++) {
        expect(() => guard.canActivate(attempts[i])).toThrow(HttpException);
      }
    });

    it('should handle rapid authentication attempts', () => {
      // Act - Make rapid attempts
      const startTime = Date.now();
      for (let i = 0; i < 5; i++) {
        guard.canActivate(mockExecutionContext);
      }
      const endTime = Date.now();

      // Assert - Should complete quickly
      expect(endTime - startTime).toBeLessThan(50); // Less than 50ms
    });
  });

  describe('configuration', () => {
    it('should use 5-minute window', () => {
      // Arrange - Make 10 attempts
      for (let i = 0; i < 10; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Act - Mock time passing (4 minutes - should still be blocked)
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => originalDateNow() + 4 * 60 * 1000);

      // Assert - Should still be blocked
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(HttpException);

      // Act - Mock time passing (6 minutes - should be allowed)
      Date.now = jest.fn(() => originalDateNow() + 6 * 60 * 1000);

      // Assert - Should be allowed
      expect(() => guard.canActivate(mockExecutionContext)).not.toThrow();

      // Restore original Date.now
      Date.now = originalDateNow;
    });

    it('should use 10-request limit', () => {
      // Act - Make exactly 10 attempts
      for (let i = 0; i < 10; i++) {
        expect(() => guard.canActivate(mockExecutionContext)).not.toThrow();
      }

      // Assert - 11th attempt should be blocked
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(HttpException);
    });
  });
}); 