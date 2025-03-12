import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateOrganizationDTO } from "src/organizations/dtos/create-organization.dto";
import { CreateUserDTO } from "src/users/dtos/create-user.dto";
import { AuthService } from "./auth.service";
import { RequestOTP, VerifyOTP } from "./dto/otp.dto";
import { HasProfileGuard } from "./guards/has-profile.guard";
import { AuthGuard } from "./guards/auth.guard";
import { AdminLogin } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // create new user
  @Post("/signup/user")
  async signUpAsUser(@Body() userData: CreateUserDTO) {
    return await this.authService.createUser(userData);
  }

  // add organization details
  @Patch("/signup/:reference/organization")
  async signUpAsOrganization(
    @Body() organizationData: CreateOrganizationDTO,
    @Param("reference") reference: string,
  ) {
    return await this.authService.createOrganization(
      organizationData,
      reference,
    );
  }

  // verify contact and confirm onboarding
  @Patch("/signup/:reference/confirm")
  async confirmOnboarding(
    @Param("reference") reference: string,
    @Body() verifyOtpData: VerifyOTP,
  ) {
    // return await this.authService.completeOnboarding(reference, verifyOtpData);
    return {
      message: "Confirmed",
    };
  }

  // login
  @Post("/otp/request")
  @HttpCode(200)
  @UseGuards(HasProfileGuard)
  async requestOtp(@Body() data: RequestOTP) {
    return await this.authService.requestOtp(data);
  }

  @Post("/login")
  @UseGuards(HasProfileGuard)
  async login(@Body() data: VerifyOTP) {
    return await this.authService.login(data);
  }

  @Get("/me")
  @UseGuards(AuthGuard)
  async getLoggedInUserDetails() {
    return await this.authService.getLoggedInUserDetails();
  }

  @Post("/admin/login")
  async authenticatedAdmin(@Body() data: AdminLogin) {
    return await this.authService.loginAsAdmin(data);
  }
}
