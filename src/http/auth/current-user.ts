import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface AuthUser {
  sub: string;
  permissions?: string[];
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUser => {
    // const request = context.switchToHttp().getRequest();

    const graphqlContext = GqlExecutionContext.create(context);

    const request = graphqlContext.getContext().req;

    return request.auth;
  },
);
