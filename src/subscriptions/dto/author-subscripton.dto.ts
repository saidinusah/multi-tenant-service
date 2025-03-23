import { IsUUID } from "class-validator";

export class CreateSubscriptionDto {
  @IsUUID()
  packageId: string;

  @IsUUID()
  memberId: string;
}
