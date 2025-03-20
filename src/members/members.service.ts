import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { PrismaService } from "src/services/prisma.service";
import { StoreMember } from "./dto/store-member.dto";
import { Prisma } from "@prisma/client";
import { PackagesService } from "src/subscriptions/packages.service";

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

    if (data.packageId) {
      await this.packagesService.findPackage(data.packageId);
    }
    let payload: Prisma.MemberCreateInput = {
      foreNames: data.foreNames,
      lastName: data.lastName,
      idNumber: data.idNumber,
      phoneNumber: data.phoneNumber,
      createdBy: userId,
      organization: {
        connect: { organizationId },
      },
    };
    if (data.packageId) {
      payload = {
        ...payload,
        subscriptions: {
          connect: {
            subscriptionId: data.packageId,
          },
        },
      };
    }

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
        updatedBy: userId,
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
    return await this.retrieveMember(id, organizationId);
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
