import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { StoreMember } from "./dto/store-member.dto";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";

@Injectable()
export class MembersService {
  constructor(
    private prismaService: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createMember(data: StoreMember) {
    const userId = this.request?.["userId"];
    const createdMember = await this.prismaService.member.create({
      data: {
        ...data,
        createdBy: {
          connect: { id: userId },
        },
      },
    });
    return {
      message: "Member created",
      id: createdMember.id,
    };
  }

  async updateMember(data: StoreMember, id: string) {
    const createdMember = await this.prismaService.member.update({
      where: {
        id,
      },
      data: {
        ...data,
        createdBy: {
          connect: { id: "dkdk" },
        },
      },
    });
    return {
      message: "Member created",
      id: createdMember.id,
    };
  }

  async getAllMembers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return await this.prismaService.member.findMany({
      take: limit,
      skip: offset,
    });
  }

  async getMember(id: string) {
    return await this.prismaService.member.findFirst({
      where: { id },
    });
  }
}
