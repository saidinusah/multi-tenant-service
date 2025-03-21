import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { addDays, isAfter } from "date-fns";
import { MembersService } from "src/members/members.service";
import { PackagesService } from "src/packages/packages.service";
import { PrismaService } from "src/services/prisma.service";
import { ERROR_MESSAGES, RENEWAL_PERIODS } from "src/utils/constants";
import { CreateSubscriptionDto } from "./dto/author-subscripton.dto";

@Injectable()
export class SubscriptionService {
  constructor(
    private prismaService: PrismaService,
    private packagesService: PackagesService,
    private memberService: MembersService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createSubscripton(data: CreateSubscriptionDto) {
    /**
     * TODO:: add check to see if it's a renewal
     * so sms copy is dynamically changed
     */
    //
    const userId = this.request?.["userId"];
    const _subsubscriptionPackage = await this.packagesService.findPackage(
      data.packageId,
    );
    if (!_subsubscriptionPackage) {
      throw new UnprocessableEntityException({
        errors: [{ field: "packageId", errors: ["Check field"] }],
      });
    }

    const expiresInDays =
      RENEWAL_PERIODS[_subsubscriptionPackage.renewalPeriod];
    const createdSubscription = await this.prismaService.subscription.create({
      data: {
        package: {
          connect: {
            packageId: data.packageId,
          },
        },
        member: {
          connect: {
            memberId: data.memberId,
          },
        },
        createdByUser: {
          connect: {
            userId,
          },
        },
        expiresAt: addDays(new Date().setHours(23, 59, 59), expiresInDays),
      },
    });

    return {
      message: "Subscription added",
      id: createdSubscription.subscriptionId,
    };
  }

  async renewSubscription(data: CreateSubscriptionDto) {
    const memberDetails = await this.memberService.getMember(data.memberId);

    const currentActivePackage = memberDetails.subscriptions.find(
      (subscription) => isAfter(new Date(), subscription.expiresAt),
    );

    if (currentActivePackage) {
      throw new BadRequestException("Member has an active subscription");
    }

    await this.createSubscripton(data);
  }

  async cancelSubscription(subscriptionId: string) {
    await this.prismaService.subscription
      .findFirstOrThrow({
        where: {
          subscriptionId,
        },
      })
      .catch((error) => {
        // TODO: log error
        throw new NotFoundException(ERROR_MESSAGES["NOT_FOUND"]);
      });

    await this.prismaService.subscription.update({
      where: {
        subscriptionId,
      },
      data: {
        expiresAt: new Date(),
      },
    });
    // TODO:: Send sms for termination
    return { message: "Subscription canceller", id: subscriptionId };
  }
}
