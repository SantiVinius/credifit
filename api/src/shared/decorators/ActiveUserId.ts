import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ActiveUserId = createParamDecorator<undefined>(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user?.sub;
  },
);
