import { PrismaService } from 'src/services/prisma.service';
import { CreateOrganizationDTO } from './dtos/create-organization.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationService {
  constructor(private prismaService: PrismaService) {}

  async fetchAllOrganization() {
    return await this.prismaService.organization.findMany({});
  }

  async storeOrganization(reqData: CreateOrganizationDTO) {
    await this.prismaService.organization.create({
      data: {
        ghanaPostGPS: reqData.ghanaPostGPS,
        name: reqData.name,
        phoneNumber: reqData.phoneNumber,
        email: reqData.email,
      },
    });
    return { message: 'Saved organization successfully' };
  }

  async updateOrganization(reqData: CreateOrganizationDTO, id: number) {
    await this.prismaService.organization.update({
      where: { id },
      data: {
        ghanaPostGPS: reqData.ghanaPostGPS,
        name: reqData.name,
        phoneNumber: reqData.phoneNumber,
        email: reqData.email,
      },
    });

    return { message: 'Updated organization successfully' };
  }
}
