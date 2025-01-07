import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { OrganizationModule } from "./organizations/organization.module";
import { RoleModule } from "./roles/roles.module";
import { UserModule } from "./users/user.module";

@Module({
  imports: [
    // CacheModule.register(),
    ConfigModule.forRoot(),
    UserModule,
    RoleModule,
    OrganizationModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
