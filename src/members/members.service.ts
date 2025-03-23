import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import { addDays } from "date-fns";
import { Request } from "express";
import { PackagesService } from "src/packages/packages.service";
import { PrismaService } from "src/services/prisma.service";
import { ERROR_MESSAGES, RENEWAL_PERIODS } from "src/utils/constants";
import { StoreMember, UpdateMember } from "./dto/store-member.dto";

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

    // TODO:: add event to trigger an sms saying they've onboarded with the package
    return {
      message: "Member created",
      id: createdMember.memberId,
    };
  }

  async updateMember(data: UpdateMember, id: string) {
    const organizationId = this.request?.["organizationId"];
    const userId = this.request?.["userId"];
    console.log("organizationId", organizationId);
    await this.retrieveMember(id, organizationId);
    const updatedMember = await this.prismaService.member.update({
      where: {
        memberId: id,
      },
      data: {
        foreNames: data.foreNames,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        idNumber: data.idNumber,
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
    return this.prismaService.member.findMany({
      take: limit,
      skip: offset,
      where: {
        organizationId: organizationId,
      },
    });
  }

  async getMember(id: string) {
    const organizationId = this.request?.["organizationId"];
    const _memberDetails = await this.prismaService.member.findFirst({
      where: { memberId: id, organizationId },
      include: {
        subscriptions: true,
      },
    });

    if (!_memberDetails) {
      throw new NotFoundException(ERROR_MESSAGES["NOT_FOUND"]);
    }
    return _memberDetails;
  }

  private async retrieveMember(memberId: string, organizationId: string) {
    console.log("args", { memberId, organizationId });
    const member = await this.prismaService.member.findFirst({
      where: { memberId, organizationId },
    });

    if (!member) {
      throw new NotFoundException(ERROR_MESSAGES["NOT_FOUND"]);
    }
    return member;
  }
}
