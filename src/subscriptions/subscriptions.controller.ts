import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { StoreSubscription } from "./dto/store-subscription.dto";
import { SubscriptionService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}
  @Post()
  async createSubscriptionPackage(@Body() data: StoreSubscription) {
    return await this.subscriptionService.createNew(data);
  }

  @Patch("id")
  async updateSubscriptionPackage(
    @Body() data: StoreSubscription,
    @Param("id") id: string,
  ) {
    return await this.subscriptionService.updateSubscription(data, id);
  }

  @Delete("id")
  async deleteSubscriptionPackage(@Param("id") id: string) {
    return await this.subscriptionService.deleteSubscriptionPackage(id);
  }

  @Get("id")
  async getSubscriptionPackage(@Param("id") id: string) {
    return await this.subscriptionService.findPackage(id);
  }
}
