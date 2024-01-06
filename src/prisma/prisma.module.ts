import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // makes the PrismaService available to all modules without having to import it in each module. This is a global module. This is a way to share a service between multiple modules without having to import it in each module. This is a way to share a service between multiple modules without having to import it in each
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
