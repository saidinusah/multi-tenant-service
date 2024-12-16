import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  providers: [OrganizationService, PrismaService],
  controllers: [OrganizationController],
  imports: [],
})
export class OrganizationModule {}
