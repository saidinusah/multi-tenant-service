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

  async createSubscription(data: CreateSubscriptionDto) {
    /**
     * TODO:: add check to see if it's a renewal
     * so sms copy is dynamically changed
     */
    //
    const userId = this.request?.["userId"];
    // check if package is valid
    const _subscriptionPackage = await this.packagesService.findPackage(
      data.packageId,
    );
    if (!_subscriptionPackage) {
      throw new UnprocessableEntityException({
        errors: [{ field: "packageId", errors: ["Check field"] }],
      });
    }

    // check if member doesn't have an active subscription
    const _memberDetails = await this.memberService.getMember(data.memberId);
    const currentActivePackage = _memberDetails.subscriptions.find(
      (subscription) => isAfter(new Date(), subscription.expiresAt),
    );

    // if they have an active one, we throw an error
    if (currentActivePackage) {
      throw new BadRequestException("Member has an active subscription");
    }

    const expiresInDays = RENEWAL_PERIODS[_subscriptionPackage.renewalPeriod];
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

  // idk if this is important because if it's pay as you go then cool,
  // but if we're looking at fixed period, they can just run it out
  async cancelSubscription(subscriptionId: string) {
    const _subscription = await this.prismaService.subscription.findFirst({
      where: {
        subscriptionId,
      },
    });

    if (!_subscription) {
      throw new NotFoundException(ERROR_MESSAGES["NOT_FOUND"]);
    }

    //TODO:: come back to this query if i make up my mind about cancellation
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
