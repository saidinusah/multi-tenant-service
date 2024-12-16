import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateRoleDTO } from './dto/create-role.dto';

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

  async updateRole(data: CreateRoleDTO, id: number) {
    return await this.prismaService.role.update({
      where: { id },
      data,
    });
  }

  async deleteRole(id: number) {
    return await this.prismaService.role.delete({ where: { id } });
  }
}
