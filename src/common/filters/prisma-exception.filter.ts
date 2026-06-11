import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";


@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (exception.code === 'P2002') {
      throw new ConflictException("Unique constraint failed");
    }

    if (exception.code === 'P2025') {
      throw new NotFoundException('Record not found');
    }

    throw exception;
  }
}