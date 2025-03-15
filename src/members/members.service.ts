import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { PrismaService } from "src/services/prisma.service";
import { StoreMember } from "./dto/store-member.dto";

@Injectable()
export class MembersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createMember(data: StoreMember) {
    const userId = this.request?.["userId"];
    const organizationId = this.request?.["organizationId"];
    const createdMember = await this.prismaService.member.create({
      data: {
        foreNames: data.foreNames,
        lastName: data.lastName,
        idNumber: data.idNumber,
        phoneNumber: data.phoneNumber,
        user: {
          connect: { userId },
        },
        organization: {
          connect: { organizationId },
        },
      },
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
    console.log("organization", organizationId);

    return await this.prismaService.member.findFirst({
      where: { memberId: id, organizationId },
    });
  }

  private async retrieveMember(id: string, organizationId: string) {
    return await this.prismaService.member.findFirstOrThrow({
      where: { memberId: id, organizationId },
    });
  }
}
