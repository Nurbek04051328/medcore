import { 
  ArgumentsHost, 
  Catch, 
  ExceptionFilter, 
  HttpException, 
  HttpStatus 
} from "@nestjs/common";



@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const exceptionResponse = 
      exception instanceof HttpException
        ? exception.getResponse()
        : "Interbal server error";

    const message = 
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message
        : exceptionResponse;

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
} 