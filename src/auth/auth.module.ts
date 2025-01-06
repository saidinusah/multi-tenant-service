import { Module } from '@nestjs/common';
import { OTPService } from 'src/services/otp.service';
import { PrismaService } from 'src/services/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, OTPService, JwtService],
  imports: [CacheModule.register()],
})
export class AuthModule {}
