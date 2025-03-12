import { IsNotEmpty, IsPositive, IsString } from "class-validator";

export class StoreSubscription {
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
