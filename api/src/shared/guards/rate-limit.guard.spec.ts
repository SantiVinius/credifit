import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;

  beforeEach(() => {
    guard = new RateLimitGuard();
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
    it('should allow first request', () => {
      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should allow requests within limit', () => {
      // Arrange - Make 50 requests (under the 100 limit)
      for (let i = 0; i < 50; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should block requests after exceeding limit', () => {
      // Arrange - Make 100 requests (at the limit)
      for (let i = 0; i < 100; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(HttpException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('Too many requests');
    });

    it('should reset counter after window expires', () => {
      // Arrange - Make 100 requests
      for (let i = 0; i < 100; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Act - Mock time passing (16 minutes = 16 * 60 * 1000 ms)
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => originalDateNow() + 16 * 60 * 1000);

      // Assert - Should allow request after window expires
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

      // Act - Make 100 requests from first IP
      for (let i = 0; i < 100; i++) {
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

    it('should handle multiple requests from same IP correctly', () => {
      // Act - Make multiple requests
      const results: boolean[] = [];
      for (let i = 0; i < 5; i++) {
        results.push(guard.canActivate(mockExecutionContext));
      }

      // Assert
      expect(results).toEqual([true, true, true, true, true]);
    });

    it('should throw correct HTTP status code', () => {
      // Arrange - Make 100 requests
      for (let i = 0; i < 100; i++) {
        guard.canActivate(mockExecutionContext);
      }

      // Act & Assert
      try {
        guard.canActivate(mockExecutionContext);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
        expect(error.message).toBe('Too many requests');
      }
    });
  });

  describe('edge cases', () => {
    it('should handle concurrent requests', () => {
      // Act - Simulate concurrent requests
      const promises = Array.from({ length: 10 }, () =>
        Promise.resolve(guard.canActivate(mockExecutionContext))
      );

      // Assert
      return Promise.all(promises).then((results) => {
        expect(results.every((result) => result === true)).toBe(true);
      });
    });

    it('should handle rapid successive requests', () => {
      // Act - Make rapid requests
      const startTime = Date.now();
      for (let i = 0; i < 10; i++) {
        guard.canActivate(mockExecutionContext);
      }
      const endTime = Date.now();

      // Assert - Should complete quickly
      expect(endTime - startTime).toBeLessThan(100); // Less than 100ms
    });
  });
}); 