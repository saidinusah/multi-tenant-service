import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { PrismaService } from "src/services/prisma.service";
import { StoreMember } from "./dto/store-member.dto";
import { Prisma } from "@prisma/client";
import { PackagesService } from "src/packages/packages.service";
import { RENEWAL_PERIODS } from "src/utils/constants";
import { addDays } from "date-fns";

@Injectable()
export class MembersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) private request: Request,
    private packagesService: PackagesService,
  ) {}

  async createMember(data: StoreMember) {
    const userId = this.request?.["userId"];
    const organizationId = this.request?.["organizationId"];
    const _subscriptionPackage = await this.packagesService.findPackage(
      data.packageId,
    );

    if (!_subscriptionPackage) {
      throw new BadRequestException("Please confirm package details");
    }

    const payload: Prisma.MemberCreateInput = {
      foreNames: data.foreNames,
      lastName: data.lastName,
      idNumber: data.idNumber,
      phoneNumber: data.phoneNumber,
      createdByUser: { connect: { userId } },
      organization: {
        connect: { organizationId },
      },
      subscriptions: {
        create: {
          package: {
            connect: {
              packageId: data.packageId,
            },
          },
          expiresAt: addDays(
            new Date().setHours(23, 59, 59),
            RENEWAL_PERIODS[_subscriptionPackage.renewalPeriod],
          ),
          createdByUser: {
            connect: {
              userId,
            },
          },
        },
      },
    };

    const createdMember = await this.prismaService.member.create({
      data: payload,
    });
    return {
      message: "Member created",
      id: createdMember.memberId,
    };
  }

  async updateMember(data: StoreMember, id: string) {
    const organizationId = this.request?.["organizationId"];
    const userId = this.request?.["userId"];
    await this.retrieveMember(id, organizationId);
    const updatedMember = await this.prismaService.member.update({
      where: {
        memberId: id,
      },
      data: {
        ...data,
        updatedByUser: {
          connect: { userId: userId },
        },
      },
    });
    return {
      message: "Member created",
      id: updatedMember.memberId,
    };
  }

  async getAllMembers(page = 1, limit = 10) {
    const organizationId = this.request?.["organizationId"];
    const offset = (page - 1) * limit;
    return await this.prismaService.member.findMany({
      take: limit,
      skip: offset,
      where: {
        organizationId: organizationId,
      },
    });
  }

  async getMember(id: string) {
    const organizationId = this.request?.["organizationId"];
    return await this.prismaService.member.findFirstOrThrow({
      where: { memberId: id, organizationId },
      include: {
        subscriptions: true,
      },
    });
  }

  private async retrieveMember(id: string, organizationId: string) {
    return await this.prismaService.member
      .findFirstOrThrow({
        where: { memberId: id, organizationId },
      })
      .catch(() => {
        throw new NotFoundException("Resource not found");
      });
  }
}
