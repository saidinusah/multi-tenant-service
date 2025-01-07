import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { CreateOrganizationDTO } from "src/organizations/dtos/create-organization.dto";
import { CreateUserDTO } from "src/users/dtos/create-user.dto";
import { AuthService } from "./auth.service";
import { RequestOTP, VerifyOTP } from "./dto/otp.dto";

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
    return await this.authService.completeOnboarding(reference, verifyOtpData);
  }

  // login
  @Post("/otp/request")
  async requestOtp(@Body() data: RequestOTP) {
    return await this.authService.requestOtp(data);
  }
}
