import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { CreateOrganizationDTO } from 'src/organizations/dtos/create-organization.dto';
import { VerifyOTP } from './dto/otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup/user')
  async signUpAsUser(@Body() userData: CreateUserDTO) {
    return await this.authService.createUser(userData);
  }

  @Patch('/signup/:reference/organization')
  async signUpAsOrganization(
    @Body() organizationData: CreateOrganizationDTO,
    @Param('reference') reference: string,
  ) {
    return await this.authService.createOrganization(
      organizationData,
      reference,
    );
  }

  @Patch('/signup/:reference/confirm')
  async confirmOnboarding(
    @Param('reference') reference: string,
    @Body() verifyOtpData: VerifyOTP,
  ) {
    return await this.authService.completeOnboarding(reference, verifyOtpData);
  }
}
