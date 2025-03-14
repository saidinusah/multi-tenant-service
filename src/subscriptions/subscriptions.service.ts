import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { StoreSubscription } from "./dto/store-subscription.dto";

@Injectable()
export class SubscriptionService {
  constructor(private prismaService: PrismaService) {}

  async createNew(data: StoreSubscription) {
    const createdSubscription =
      await this.prismaService.subscriptionPackages.create({
        data: {
          ...data,
          createdBy: "saidinusah29@gmail.com",
        },
      });

    return { message: "Created subscription", id: createdSubscription.id };
  }

  async updateSubscription(data: StoreSubscription, id: string) {
    const createdSubscription =
      await this.prismaService.subscriptionPackages.update({
        where: { subscriptionId: id },
        data: {
          ...data,
        },
      });

    return { message: "Updated subscription", id: createdSubscription.id };
  }

  async findAll() {
    return await this.prismaService.subscriptionPackages.findMany({
      take: 20,
      skip: 0,
    });
  }

  async deleteSubscriptionPackage(id: string) {
    const subscriptionPackage = await this.findPackage(id);
    await this.prismaService.subscriptionPackages.update({
      where: { subscriptionId: id },
      data: { isActive: false },
    });
    return {
      message: "Subscription package updated",
      id: subscriptionPackage.id,
    };
  }

  async findPackage(id: string) {
    return await this.prismaService.subscriptionPackages.findFirstOrThrow({
      where: { subscriptionId: id },
    });
  }
}
