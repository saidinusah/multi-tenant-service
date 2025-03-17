import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

const defaultStatusCode: HttpStatus = HttpStatus.BAD_REQUEST;
const defaultServerMessage = "An error occured while processing your request";
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;

    const responseBody = {
      status:
        httpStatus === HttpStatus.INTERNAL_SERVER_ERROR
          ? defaultStatusCode
          : httpStatus,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: ctx.getResponse()?.message || defaultServerMessage,
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
