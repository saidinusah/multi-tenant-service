import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { StoreSubscription } from "./dto/store-package.dto";
import { PackagesService } from "./packages.service";

@Controller("packages")
@UseGuards(AuthGuard)
export class PackagesController {
  constructor(private subscriptionService: PackagesService) {}

  @Post()
  async createPackage(@Body() data: StoreSubscription) {
    return await this.subscriptionService.createNew(data);
  }

  @Patch(":id")
  async updateSubscriptionPackage(
    @Body() data: StoreSubscription,
    @Param("id") id: string,
  ) {
    return await this.subscriptionService.updateSubscription(data, id);
  }

  @Delete(":id")
  async deletePackage(@Param("id") id: string) {
    return await this.subscriptionService.deactivatePackge(id);
  }

  @Get(":id")
  async getPackage(@Param("id") id: string) {
    return await this.subscriptionService.findPackage(id);
  }

  @Get()
  async getAllPackages(
    @Query("limit") limit?: number,
    @Query("page") page?: number,
    @Query("search") search?: string,
    @Query("status") status?: string,
  ) {
    return await this.subscriptionService.findAll(limit, page, search, status);
  }
}
