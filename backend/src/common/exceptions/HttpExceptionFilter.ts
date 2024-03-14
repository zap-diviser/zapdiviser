//HttpExceptionFilter
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<any>();

    let status =
      exception instanceof HttpException
        ? exception?.getStatus?.()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.message === 'Validation failed') {
      return response.status(400).send(exception.getResponse());
    }

    console.log({
      ...exception,
    });

    const error_formatted: any = {
      error: {
        type: exception.name,
        message: exception.message,
        string_code: (exception?.getResponse?.() as any)?.short_code,
        timestamp: new Date().toISOString(),
        instance: request.url,
        code: status,
        body: request.body,
      },
    };

    switch (exception.name) {
      case 'QueryFailedError': {
        error_formatted.error.message =
          'Erro ao executar a consulta no banco de dados';
        error_formatted.error.invalid_params = exception['parameters'];
        error_formatted.error.routine = exception['routine'];
        error_formatted.error.detail = exception['detail'];
        error_formatted.error.column = exception['column'];
        status = 400;
        break;
      }
      case 'EntityNotFoundError': {
        error_formatted.error.message = 'Registro não encontrado';
        error_formatted.error.invalid_params = exception['parameters'];
        error_formatted.error.routine = exception['routine'];
        error_formatted.error.detail = exception['detail'];
        error_formatted.error.column = exception['column'];
        status = 404;
        break;
      }
    }

    response
      .status(status)
      .header('Content-Type', 'application/problem+json')
      .send(error_formatted);
  }
}
