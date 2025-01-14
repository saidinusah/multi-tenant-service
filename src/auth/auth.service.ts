import { InjectQueue } from "@nestjs/bull";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  BadRequestException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { Queue } from "bull";
import { Cache } from "cache-manager";
import { addSeconds } from "date-fns";
import { nanoid } from "nanoid";
import { CreateOrganizationDTO } from "src/organizations/dtos/create-organization.dto";
import { OTPService } from "src/services/otp.service";
import { PrismaService } from "src/services/prisma.service";
import { CreateUserDTO } from "src/users/dtos/create-user.dto";
import { generateOrganizationCacheKey } from "src/utils/helpers";
import { JobNames, QueueNames } from "../utils/constants";
import { RequestOTP, VerifyOTP } from "./dto/otp.dto";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";

const CACHE_EXPIRY = 60 * 1000 * 3600;
const JWT_EXIPIRY = 3600 * 12;

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManger: Cache,
    private prismaService: PrismaService,
    private otpService: OTPService,
    private jwtService: JwtService,
    @InjectQueue(QueueNames.NOTIFICATION)
    private readonly notificationQueue: Queue,
    @Inject(REQUEST) private request: Request,
  ) {}
  private jwtEncryptionKey = process.env.JWT_SECRET;

  async createUser(data: CreateUserDTO) {
    const generatedKey = "user_creation_" + nanoid();
    await this.cacheManger.set(generatedKey, data, CACHE_EXPIRY);
    return {
      key: generatedKey,

      message: "User data saved",
    };
  }

  async createOrganization(data: CreateOrganizationDTO, reference: string) {
    const userData: CreateUserDTO = await this.cacheManger.get(reference);

    if (!userData) {
      throw new UnprocessableEntityException(
        "Please verify onboarding reference",
      );
    }
    await this.cacheManger.set(
      generateOrganizationCacheKey(reference),
      data,
      CACHE_EXPIRY,
    );
    await this.notificationQueue.add(JobNames.NOTIFICATION.SEND_OTP, {
      phoneNumber: userData.phoneNumber,
    });
    return {
      message:
        "OTP has been successfully sent, please check your messaging app",
    };
  }

  async completeOnboarding(reference: string, otpData: VerifyOTP) {
    const cachedUserData: CreateUserDTO = await this.cacheManger.get(reference);
    const cachedOrganizationData: CreateOrganizationDTO =
      await this.cacheManger.get(generateOrganizationCacheKey(reference));

    if (!cachedOrganizationData || !cachedUserData) {
      throw new BadRequestException("Please onboard again");
    }
    const { isVerified } = await this.otpService.verifyOtp(
      cachedUserData.phoneNumber,
      otpData.code,
    );
    if (!isVerified) {
      throw new UnauthorizedException("Please confirm OTP code");
    }

    await this.prismaService.$transaction(async (tx) => {
      // first create the organization
      const createdOrganization = await tx.organization.create({
        data: {
          ...cachedOrganizationData,
          branches: {
            create: {
              ghanaPostGPS: cachedOrganizationData.ghanaPostGPS,
              type: "HEAD_OFFICE",
              phoneNumber: cachedOrganizationData.phoneNumber,
            },
          },
        },
        include: {
          branches: true,
        },
      });

      const createdUser = tx.user.create({
        data: {
          ...cachedUserData,
          branches: {
            connect: { id: createdOrganization?.branches[0]?.id },
          },
          roles: {
            connect: cachedUserData?.roles?.map((role) => ({
              id: role?.id,
            })),
          },
          organizations: {
            connect: { id: createdOrganization.id },
          },
        },
      });

      return createdUser;
    });

    await this.cacheManger.del(reference);
    await this.cacheManger.del(generateOrganizationCacheKey(reference));

    return {
      message: "Onboarding was successfully",
    };
  }

  async login(data: VerifyOTP) {
    const { isVerified } = await this.otpService.verifyOtp(
      data.phoneNumber,
      data.code,
    );
    if (!isVerified) {
      throw new UnauthorizedException("Please confirm OTP code");
    }

    const userDetails = await this.getUserDetails(data.phoneNumber);
    const tokenDetails = await this.createToken(userDetails);

    return {
      user: userDetails,
      ...tokenDetails,
    };
  }

  async getLoggedInUserDetails() {
    const user = this.request?.["user"];
    const userId = user?.id as number;
    const phoneNumber = user?.phoneNumber as string;
    return await this.getUserDetails(phoneNumber);
  }

  private async createToken(user: User) {
    const date = new Date();
    const token = await this.jwtService.sign(user, {
      expiresIn: JWT_EXIPIRY,
      privateKey: this.jwtEncryptionKey,
    });
    return { token, expiresAt: addSeconds(date, JWT_EXIPIRY) };
  }

  async requestOtp(data: RequestOTP) {
    await this.notificationQueue.add(JobNames.NOTIFICATION.SEND_OTP, {
      phoneNumber: data.phoneNumber,
    });

    return {
      message: "OTP has been sent, please check your phone",
    };
  }

  private async getUserDetails(phoneNumber: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        // id: userId,
        phoneNumber: phoneNumber,
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        organizations: {
          where: {
            users: {
              some: {
                phoneNumber: phoneNumber,
              },
            },
          },
          include: {
            branches: {
              where: {
                users: {
                  some: { phoneNumber: phoneNumber },
                },
              },
              // include: {

              //   ghanaPostGPS: true,
              //   id: true,
              //   phoneNumber: true,
              //   type: true,
              // },
            },
          },
          // select: {
          //   id: true,
          //   name: true,
          //   phoneNumber: true,
          // },
        },
      },
    });
    if (!user) throw new BadRequestException("Failed to fetch user details");
    return user;
  }
}
