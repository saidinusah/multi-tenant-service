import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { StoreMember } from "./dto/store-member.dto";
import { MembersService } from "./members.service";

@Controller("members")
@UseGuards(AuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get(":id")
  async retrieveMember(@Param("id") id: string) {
    return await this.membersService.getMember(id);
  }

  @Get()
  async getAllMembers() {
    return await this.membersService.getAllMembers();
  }

  @Post()
  async createMember(@Body() data: StoreMember) {
    return await this.membersService.createMember(data);
  }

  @Patch(":id")
  async updateMember(@Body() data: StoreMember, @Param("id") id: string) {
    return await this.membersService.updateMember(data, id);
  }
}
