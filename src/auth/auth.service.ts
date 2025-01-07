import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { Cache } from "cache-manager";
import { nanoid } from "nanoid";
import { CreateOrganizationDTO } from "src/organizations/dtos/create-organization.dto";
import { OTPService } from "src/services/otp.service";
import { PrismaService } from "src/services/prisma.service";
import { CreateUserDTO } from "src/users/dtos/create-user.dto";
import { generateOrganizationCacheKey } from "src/utils/helpers";
import { RequestOTP, VerifyOTP } from "./dto/otp.dto";

const CACHE_EXPIRY = 60 * 1000 * 3600;

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManger: Cache,
    private prismaService: PrismaService,
    private otpService: OTPService,
    private jwtService: JwtService,
  ) {}

  async createUser(data: CreateUserDTO) {
    const generatedKey = "user_creation_" + nanoid();
    await this.cacheManger.set(generatedKey, data, CACHE_EXPIRY);
    return {
      key: generatedKey,

      message: "User data saved",
    };
  }

  async createOrganization(data: CreateOrganizationDTO, reference: string) {
    await this.cacheManger.set(
      generateOrganizationCacheKey(reference),
      data,
      CACHE_EXPIRY,
    );
    const userData: CreateUserDTO = await this.cacheManger.get(reference);
    return await this.otpService.sendOtp(userData.phoneNumber);
  }

  async completeOnboarding(reference: string, otpData: VerifyOTP) {
    const { isVerified } = await this.otpService.verifyOtp(
      otpData.phoneNumber,
      otpData.code,
    );
    if (!isVerified) {
      throw new UnauthorizedException("Please confirm OTP code");
    }
    const userData: CreateUserDTO = await this.cacheManger.get(reference);
    const organization: CreateOrganizationDTO = await this.cacheManger.get(
      generateOrganizationCacheKey(reference),
    );

    if (!userData || !organization) {
      throw new BadRequestException("Please onboard again");
    }

    await this.prismaService.$transaction(async (tx) => {
      const user = await this.prismaService.user.create({
        data: {
          ...userData,
          organizations: {
            create: {
              ...organization,
              branches: {
                create: {
                  ghanaPostGPS: organization.ghanaPostGPS,
                  type: "HEAD_OFFICE",
                  phoneNumber: organization?.phoneNumber,
                },
              },
            },
          },
          roles: {
            connect: userData?.roles?.map((role) => ({ id: role.id })),
          },
        },
        include: {
          organizations: {
            include: {
              branches: true,
            },
          },
        },
      });

      const updatedUser = this.prismaService.user.update({
        where: { id: user.id },
        data: {
          branch_id: user?.organizations[0]?.branches[0].id,
        },
      });

      return updatedUser;
    });

    await this.cacheManger.del(reference);
    await this.cacheManger.del(generateOrganizationCacheKey(reference));
  }

  private async createToken(user: User) {
    const token = await this.jwtService.sign(user);
  }

  async requestOtp(data: RequestOTP) {
    await this.otpService.sendOtp(data.phoneNumber);
  }
}
