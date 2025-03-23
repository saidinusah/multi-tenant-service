import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const defaultServerMessage = "An error occurred while processing your request";

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  errCode = "";

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const err = exception as any;
    let status =
      err?.statusCode || err?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    let message = err?.message ?? defaultServerMessage;
    const meta = err?.meta || {};
    let errors = err?.errors ?? [];
    console.log("exception", exception);

    if (exception instanceof UnprocessableEntityException) {
      errors = (exception.getResponse() as any)?.errors;
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      this.errCode = exception.code;
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      switch (exception.code) {
        case "P2010":
          if (exception?.meta?.modelName === "User") {
            message = "We are unable to sign you up, please contact support";
          } else {
            message = "We can't process your request, please contact support";
          }
          break;
        default:
          message = "We can't process your request, please contact support";
      }
    } else {
      status = HttpStatus.BAD_REQUEST;
    }
    if (
      !(exception instanceof HttpException) &&
      !(exception instanceof AppExceptionFilter) &&
      !(exception instanceof PrismaClientKnownRequestError)
    ) {
      message = defaultServerMessage;
    }

    return response.status(status).json({ message, errors });
  }
}