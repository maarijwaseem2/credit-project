import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message || 'Internal server error';
    const responseMessage =
      status === HttpStatus.UNPROCESSABLE_ENTITY ? 'Missing required fields' : message;

    response.status(status).json({
      statusCode: status,
      messages: [responseMessage],
      data: [],
    });
  }
}
