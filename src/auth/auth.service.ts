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
import { Queue } from "bull";
import { Cache } from "cache-manager";
import { addSeconds } from "date-fns";
import { CreateOrganizationDTO } from "src/organizations/dtos/create-organization.dto";
import { PrismaService } from "src/services/prisma.service";
import { CreateUserDTO } from "src/users/dtos/create-user.dto";
import { generateOrganizationCacheKey } from "src/utils/helpers";
import { JobNames, QueueNames } from "../utils/constants";
import { RequestOTP, VerifyOTP } from "./dto/otp.dto";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { nanoid } from "nanoid";
import * as bcrypt from "bcrypt";
import { Login, SignUpAsAdmin } from "./dto/auth.dto";

const CACHE_EXPIRY = 60 * 1000 * 3600;
const JWT_EXIPIRY = 3600 * 12;

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManger: Cache,
    private prismaService: PrismaService,
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

  async createOrganization(data: CreateOrganizationDTO) {
    const userId = this.request?.["userId"];
    const userDetails = await this.getUserDetails(userId);
    if (userDetails.organizationId) {
      throw new BadRequestException("User has completed onboarding");
    }

    const createdOrganization = await this.prismaService.organization.create({
      data: {
        email: data.email,
        ghanaPostGPS: data.ghanaPostGPS,
        name: data.name,
        phoneNumber: data.name,
        users: {
          connect: {
            userId: userId,
          },
        },
      },
    });
    return {
      message: "Organization added successfully",
      id: createdOrganization.organizationId,
    };
  }

  async getLoggedInUserDetails() {
    const userId = this.request?.["userId"];
    return await this.getUserDetails(userId);
  }

  private async createToken(userDetails: { id: string }) {
    const date = new Date();
    const token = await this.jwtService.sign(userDetails, {
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

  async loginAsAdmin(data: Login) {
    const { hash, ...rest } = await this.getUserByEmail(data.email);

    const isMatch = await bcrypt.compare(data.password, hash);
    if (!isMatch) {
      throw new UnprocessableEntityException("Couldn't verify credentials");
    }
    const tokenDetails = await this.createToken({
      id: rest.userId,
    });

    return {
      user: rest,
      ...tokenDetails,
    };
  }

  async signUpAsAdmin(data: SignUpAsAdmin) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: data.email,
        hash: hashedPassword,
        foreNames: data.foreNames,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      },
    });
    const { id, hash, userId, ...rest } = user;
    const tokenDetails = await this.createToken({
      id: userId,
    });
    return {
      ...tokenDetails,
      user: rest,
    };
  }

  private async getUserDetails(userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        userId: userId,
      },
    });
    const { id, hash, ...rest } = user;
    if (!user) throw new BadRequestException("Failed to fetch user details");
    return rest;
  }

  private async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnprocessableEntityException("Failed to verify user");
    }
    return user;
  }
}
