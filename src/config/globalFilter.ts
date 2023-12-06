import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { TypeORMError } from 'typeorm';
import { GraphQLError } from 'graphql';



@Catch(TypeORMError)
export class GlobalExceptionFilter implements GqlExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const gqlContext = gqlHost.getContext();
    console.log('name :', exception.name);
    switch (exception.name) {
      case 'QueryFailedError':
        console.log('QueryFailedError');
        
        return new GraphQLError(exception.message, { 
          extensions: {
            code: exception.name,
            exception: { 
              message: exception.message,
              stacktrace: exception.stack, 
            },
          },
        });
      case 'EntityNotFoundError':
        return new HttpException(exception.message, HttpStatus.NOT_FOUND);
      default:
        return new HttpException(exception.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}