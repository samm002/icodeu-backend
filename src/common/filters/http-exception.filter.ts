import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseStatus } from '../enums';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 if not set
    const message = exception.message;
    const method = request.method; // Get HTTP method
    // const hostUrl = `${request.protocol}://${request.get('host')}`; // Get the base URL

    response.status(status).json({
      status: ResponseStatus.FAILED,
      resource: `${method} ${request.url}`,
      message,
    });
  }
}
