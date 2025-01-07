import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { CreateOrganizationDTO } from "./dtos/create-organization.dto";
import { FindOneParam } from "src/utils/generic-dto";

@Controller("organizations")
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // get all organizations
  @Get("/")
  async getOrganizations() {
    return await this.organizationService.fetchAllOrganization();
  }

  @Post("/")
  async createOrganization(@Body() data: CreateOrganizationDTO) {
    return await this.organizationService.storeOrganization(data);
  }

  @Put(":id")
  async updatedOrganization(
    @Body() data: CreateOrganizationDTO,
    @Param("id") id: number,
  ) {
    return await this.organizationService.updateOrganization(data, Number(id));
  }
}
