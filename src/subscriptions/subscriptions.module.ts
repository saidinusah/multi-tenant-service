import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscriptions.service";
import { SubscriptionController } from "./subscription.controller";
import { MembersService } from "../members/members.service";
import { PackagesService } from "../packages/packages.service";
import { PrismaService } from "../services/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  providers: [
    SubscriptionService,
    MembersService,
    PackagesService,
    PrismaService,
    JwtService,
  ],
  controllers: [SubscriptionController],
})
export class SubscriptionsModule {}
