import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import { Request } from "express";
import { PrismaService } from "src/services/prisma.service";
import { StoreSubscription } from "./dto/store-subscription.dto";

@Injectable()
export class PackagesService {
  constructor(
    private prismaService: PrismaService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async createNew(data: StoreSubscription) {
    const userId = this.request?.["userId"];
    const organizationId = this.request?.["organizationId"];
    const createdSubscription =
      await this.prismaService.subscriptionPackage.create({
        data: {
          ...data,
          createdByUser: {
            connect: {
              userId,
            },
          },
          organization: {
            connect: {
              organizationId,
            },
          },
        },
      });

    return {
      message: "Created subscription",
      id: createdSubscription.packageId,
    };
  }

  async updateSubscription(data: StoreSubscription, id: string) {
    const userId = this.request?.["userId"];
    const _package = await this.findPackage(id);
    if (_package.deactivedAt) {
      throw new BadRequestException("Package is not in an editable state");
    }

    const createdSubscription =
      await this.prismaService.subscriptionPackage.update({
        where: { packageId: id },
        data: {
          ...data,
          updatedByUserId: userId,
        },
      });

    return {
      message: "Updated subscription",
      id: createdSubscription.packageId,
    };
  }

  async findAll(
    limit: number,
    page?: number,
    search?: string,
    status?: string,
  ) {
    const constraints: { AND: Prisma.SubscriptionPackageWhereInput[] } = {
      AND: [
        {
          name: {
            contains: search ?? "",
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };

    if (status === "active") {
      constraints.AND.push({
        deactivedAt: {
          equals: null,
        },
      });
    }
    if (status === "inactive") {
      constraints.AND.push({
        deactivedAt: {
          not: null,
        },
      });
    }

    const _limit = limit ? Number(limit) : 20;
    const _page = page ? Number(page) : 1;
    const offset = _limit * (_page - 1);
    const count = await this.prismaService.subscriptionPackage.count({
      where: constraints,
    });
    const items = await this.prismaService.subscriptionPackage.findMany({
      take: _limit,
      skip: offset,
      where: constraints,
      select: {
        packageId: true,
        name: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
        deactivedAt: true,
        renewalPeriod: true,
        organization: {
          select: {
            name: true,
          },
        },
        createdByUser: {
          select: {
            foreNames: true,
            lastName: true,
            email: true,
          },
        },
        updatedByUser: {
          select: {
            foreNames: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return {
      items,
      meta: {
        page: _page,
        limit: _limit,
        count,
      },
    };
  }

  async deactivatePackge(id: string) {
    const userId = this.request["userId"];
    const subscriptionPackage = await this.findPackage(id);
    await this.prismaService.subscriptionPackage.update({
      where: { packageId: id },
      data: {
        deactivedAt: new Date().toISOString(),
        updatedByUser: {
          connect: {
            userId: userId,
          },
        },
      },
    });
    return {
      message: "Subscription package updated",
      id: subscriptionPackage.packageId,
    };
  }

  async findPackage(id: string) {
    const organizationId = this.request?.["organizationId"];
    return await this.prismaService.subscriptionPackage.findFirstOrThrow({
      where: { packageId: id, organizationId: organizationId },
    });
  }
}
