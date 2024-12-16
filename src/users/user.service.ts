import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateUserDTO } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaServivce: PrismaService) {}

  async getUsers() {
    return await this.prismaServivce.user.findMany();
  }

  async createNewUser(data: CreateUserDTO) {
    return await this.prismaServivce.user.create({
      data: {
        ...data,
        roles: {
          create: data?.roles?.map((role) => ({
            role: {
              connectOrCreate: {
                where: {
                  id: role.id,
                },
                create: {
                  name: role.name,
                },
              },
            },
          })),
        },
      },
    });
  }
}
