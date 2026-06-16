import { Injectable } from "@nestjs/common";
import { DatabaseSync } from "node:sqlite";
import { uptime } from "process";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class HealthService {
  constructor (private readonly prisma: PrismaService) {}

  async check() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      Database: 'connected',
      uptime: process.uptime(),
    };
  }
}