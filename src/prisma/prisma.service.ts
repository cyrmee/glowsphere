import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          // url: 'postgresql://postgres:password@localhost:5432/glowsphere?schema=public',
          // url: process.env.DATABASE_URL,
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async cleanDb() {
    return await this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
