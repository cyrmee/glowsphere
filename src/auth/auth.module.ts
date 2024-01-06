import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [JwtModule.register({})], // you don't need to import modules here if the modules are global
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
