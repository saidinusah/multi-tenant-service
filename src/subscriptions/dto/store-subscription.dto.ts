import { RenewalPeriods } from "@prisma/client";
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class StoreSubscription {
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsIn(Object.values(RenewalPeriods))
  renewalPeriod: string;
}
