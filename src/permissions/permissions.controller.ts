import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";

@Controller()
export class PermissionsController {
  constructor(private permissionService: PermissionsService) {}

  @Get("/")
  async fetchAllPermission() {
    return await this.permissionService.getPermissions();
  }

  @Patch(":id")
  async updatedPermission() {
    return await this.permissionService.updatePermission();
  }

  @Delete(":id")
  async deletePermission() {
    return await this.permissionService.deletePermission();
  }

  @Post("/")
  async createPermission() {
    return await this.permissionService.createPermission();
  }
}
