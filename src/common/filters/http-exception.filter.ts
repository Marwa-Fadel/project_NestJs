import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

// 9. Exception Filters
@Catch() // catch everything, differentiate below
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // exception.message is always the generic label (e.g. "Bad Request Exception").
      // getResponse() has the real detail, including the Pipe's validation messages.
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: unknown }).message ?? exception.message;

      response.status(status).json({
        success: false,
        errorCode: status,
        message,
      });
      return;
    }

    // Not an HttpException (unexpected bug) - keep the same envelope shape
    console.error(exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error.',
    });
  }
}
