import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { REGEXES } from "../../utils/constants";

@Injectable()
export class HasProfileGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userPhoneNumber = request.body.phoneNumber;

    if (
      !Boolean(userPhoneNumber) ||
      !REGEXES.GHANA_PHONE_NUMBER.test(userPhoneNumber)
    ) {
      throw new BadRequestException("Please enter a valid phone number");
    }

    try {
      const user = await this.prismaService.user.findFirst({
        where: { phoneNumber: userPhoneNumber },
      });
      if (!user) {
        throw new BadRequestException("Invalid phone number");
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Invalid phone number");
    }

    return true;
  }
}
