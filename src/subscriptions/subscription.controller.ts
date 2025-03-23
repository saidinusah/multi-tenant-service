import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/author-subscripton.dto";
import { SubscriptionService } from "./subscriptions.service";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("subscriptions")
@UseGuards(AuthGuard)
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post(["", "renew"])
  async createSubscription(@Body() data: CreateSubscriptionDto) {
    return await this.subscriptionService.createSubscription(data);
  }

  @Post(":subscriptionId")
  async cancelSubscription(@Param("subscriptionId") subscriptionId: string) {
    return await this.subscriptionService.cancelSubscription(subscriptionId);
  }
}
