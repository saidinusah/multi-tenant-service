import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dtos/create-user.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async fetchAllUsers() {
    return await this.userService.getUsers();
  }

  @Post()
  async createUser(@Body() data: CreateUserDTO) {
    await this.userService.createNewUser(data);
    return { message: "stored user successfully" };
  }
}
