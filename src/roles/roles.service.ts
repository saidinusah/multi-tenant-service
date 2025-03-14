import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { CreateRoleDTO } from "./dto/create-role.dto";

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async getAllRoles() {
    return await this.prismaService.role.findMany({});
  }

  async store(data: CreateRoleDTO) {
    return await this.prismaService.role.create({
      data,
    });
  }

  async updateRole(data: CreateRoleDTO, id: string) {
    return await this.prismaService.role.update({
      where: { roleId: id },
      data,
    });
  }

  async deleteRole(id: string) {
    return await this.prismaService.role.delete({ where: { roleId: id } });
  }
}
