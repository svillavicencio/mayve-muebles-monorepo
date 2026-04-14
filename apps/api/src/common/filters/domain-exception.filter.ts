import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { CategoryNotEmptyException } from '../../products/domain/exceptions/category-not-empty.exception';

@Catch(CategoryNotEmptyException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: CategoryNotEmptyException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
