import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { StoreMember } from "./dto/store-member.dto";

@Injectable()
export class MembersService {
  constructor(private prismaService: PrismaService) {}

  async createMember(data: StoreMember) {
    const createdMember = await this.prismaService.member.create({
      data: {
        ...data,
        createdBy: {
          connect: {
            id: 1,
          },
        },
      },
    });
    return {
      message: "Member created",
      id: createdMember.id,
    };
  }

  async updateMember(data: StoreMember, id: number) {
    const createdMember = await this.prismaService.member.update({
      where: {
        id,
      },
      data: {
        ...data,
        createdBy: {
          connect: {
            id: 1,
          },
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

  async getMember(id: number) {
    return await this.prismaService.member.findFirst({
      where: { id: Number(id) },
    });
  }
}
