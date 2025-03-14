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
import { Login, SignUpAsAdmin } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // create new user
  @Post("/signup/user")
  async signUpAsUser(@Body() userData: CreateUserDTO) {
    return await this.authService.createUser(userData);
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

  @Get("/me")
  @UseGuards(AuthGuard)
  async getLoggedInUserDetails() {
    return await this.authService.getLoggedInUserDetails();
  }

  @Post("/login")
  async authenticateAdmin(@Body() data: Login) {
    return await this.authService.loginAsAdmin(data);
  }

  @Post("/signup")
  async signUpAsAdmin(@Body() data: SignUpAsAdmin) {
    return await this.authService.signUpAsAdmin(data);
  }

  @Post("/add-organization")
  @UseGuards(AuthGuard)
  async addOrganization(@Body() data: CreateOrganizationDTO) {
    return await this.authService.createOrganization(data);
  }
}
