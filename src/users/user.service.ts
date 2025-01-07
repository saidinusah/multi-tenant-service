import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { CreateUserDTO } from "./dtos/create-user.dto";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUsers() {
    return await this.prismaService.user.findMany();
  }

  async createNewUser(data: CreateUserDTO) {
    return await this.prismaService.user.create({
      data: {
        ...data,
        roles: {
          connect: data?.roles?.map((role) => ({ id: role.id })),
        },
      },
    });
  }
}
