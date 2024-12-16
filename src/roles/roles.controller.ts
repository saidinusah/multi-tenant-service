import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDTO } from './dto/create-role.dto';
import { FindOneParam } from 'src/helpers/generic-dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Get()
  async fetchRoles() {
    return await this.rolesService.getAllRoles();
  }

  @Post()
  async createNewRole(@Body() reqData: CreateRoleDTO) {
    await this.rolesService.store(reqData);
    return { message: 'Saved role successfully' };
  }

  @Put(':id')
  async updateRole(@Body() reqData: CreateRoleDTO, @Param('id') id: number) {
    await this.rolesService.updateRole(reqData, id);

    return { message: 'Updated role successfully' };
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: number) {
    await this.rolesService.deleteRole(id);
    return { message: 'Deleted role successfully' };
  }
}
