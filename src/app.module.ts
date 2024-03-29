import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make it available to all modules
      // envFilePath: ['.env', '.env.development'], // load .env file
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    CommonModule,
  ],
})
export class AppModule {}
