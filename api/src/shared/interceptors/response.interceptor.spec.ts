import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler<any>>;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
        }),
      }),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should wrap successful response in standard format', (done) => {
      // Arrange
      const mockData = { id: 1, name: 'Test' };
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      } as any;

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            data: mockData,
            message: 'Success',
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should handle null response', (done) => {
      // Arrange
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(null)),
      } as any;

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            data: null,
            message: 'Success',
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should handle empty response', (done) => {
      // Arrange
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(undefined)),
      } as any;

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            data: undefined,
            message: 'Success',
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should handle array response', (done) => {
      // Arrange
      const mockArray = [{ id: 1 }, { id: 2 }];
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(mockArray)),
      } as any;

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            data: mockArray,
            message: 'Success',
            timestamp: expect.any(String),
          });
          done();
        },
        error: done,
      });
    });

    it('should include valid timestamp', (done) => {
      // Arrange
      const mockData = { test: 'data' };
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      } as any;

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result.timestamp).toBeDefined();
          expect(typeof result.timestamp).toBe('string');

          // Verify timestamp is a valid ISO string
          const timestamp = new Date(result.timestamp);
          expect(timestamp.getTime()).not.toBeNaN();

          done();
        },
        error: done,
      });
    });

    it('should preserve original data structure', (done) => {
      // Arrange
      const complexData = {
        user: {
          id: 1,
          name: 'John',
          profile: {
            email: 'john@example.com',
            preferences: ['dark-mode', 'notifications'],
          },
        },
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date(),
        },
      };
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(complexData)),
      } as any;

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result.data).toEqual(complexData);
          expect(result.data.user.profile.preferences).toEqual([
            'dark-mode',
            'notifications',
          ]);
          done();
        },
        error: done,
      });
    });

    it('should handle nested objects with methods', (done) => {
      // Arrange
      const objectWithMethod = {
        id: 1,
        name: 'Test',
        getFullName: () => 'Test Object',
      };
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(objectWithMethod)),
      } as any;

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result.data).toEqual(objectWithMethod);
          expect(typeof result.data.getFullName).toBe('function');
          done();
        },
        error: done,
      });
    });

    it('should maintain consistent response structure', (done) => {
      // Arrange
      const testCases = [
        { input: 'string', expected: 'string' },
        { input: 123, expected: 123 },
        { input: true, expected: true },
        { input: false, expected: false },
        { input: [], expected: [] },
        { input: {}, expected: {} },
      ];

      let completedTests = 0;
      const totalTests = testCases.length;

      testCases.forEach(({ input, expected }) => {
        mockCallHandler = {
          handle: jest.fn().mockReturnValue(of(input)),
        } as any;

        // Act
        const result$ = interceptor.intercept(
          mockExecutionContext,
          mockCallHandler,
        );

        // Assert
        result$.subscribe({
          next: (result) => {
            expect(result).toHaveProperty('success', true);
            expect(result).toHaveProperty('data', expected);
            expect(result).toHaveProperty('message', 'Success');
            expect(result).toHaveProperty('timestamp');

            completedTests++;
            if (completedTests === totalTests) {
              done();
            }
          },
          error: done,
        });
      });
    });
  });

  describe('response format validation', () => {
    it('should always return success: true for successful responses', (done) => {
      // Arrange
      const mockData = { test: 'data' };
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      } as any;

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result.success).toBe(true);
          done();
        },
        error: done,
      });
    });

    it('should always include required fields', (done) => {
      // Arrange
      const mockData = { test: 'data' };
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      } as any;

      // Act
      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toHaveProperty('success');
          expect(result).toHaveProperty('data');
          expect(result).toHaveProperty('message');
          expect(result).toHaveProperty('timestamp');
          done();
        },
        error: done,
      });
    });
  });
});
