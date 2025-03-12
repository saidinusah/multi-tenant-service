import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { StoreMember } from "./dto/store-member.dto";
import { MembersService } from "./members.service";

@Controller("members")
export class MembersController {
  constructor(private memberservice: MembersService) {}

  @Get()
  async getAllMembers() {
    return await this.memberservice.getAllMembers();
  }

  @Post()
  async createMember(@Body() data: StoreMember) {
    return await this.memberservice.createMember(data);
  }

  @Patch(":id")
  async updateMember(@Body() data: StoreMember, @Param("id") id: number) {
    return {
      message: "Member updated successfully",
    };
  }

  @Get(":id")
  async retrieveMember(@Param("id") id: number) {
    return await this.memberservice.getMember(id);
  }
}
