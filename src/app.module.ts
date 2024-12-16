import { Module } from '@nestjs/common';
import { OrganizationModule } from './organizations/organization.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { RoleModule } from './roles/roles.module';

@Module({
  imports: [OrganizationModule, ConfigModule.forRoot(), UserModule, RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
