import { Module } from "@nestjs/common";

import { PrismaService } from "src/services/prisma.service";
import { SubscriptionController } from "./subscriptions.controller";
import { SubscriptionService } from "./subscriptions.service";

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PrismaService],
})
export class SubscriptionModule {}
