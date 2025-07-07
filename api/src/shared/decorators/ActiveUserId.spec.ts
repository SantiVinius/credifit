import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ActiveUserId } from './ActiveUserId';

describe('ActiveUserId', () => {
  let mockExecutionContext: any;

  beforeEach(() => {
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ActiveUserId decorator', () => {
    it('should create a decorator function', () => {
      // Act
      const decorator = ActiveUserId(undefined, mockExecutionContext);

      // Assert
      expect(typeof decorator).toBe('function');
    });
  });
}); 