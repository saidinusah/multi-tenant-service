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
          createdBy: {
            connect: {
              id: 1,
            },
          },
        },
      });

    return { message: "Created subscription", id: createdSubscription.id };
  }

  async updateSubscription(data: StoreSubscription, id: number) {
    const createdSubscription =
      await this.prismaService.subscriptionPackages.update({
        where: { id },
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
}
