import { plainToInstance } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  validateSync,
} from "class-validator";

export class EnvValidation {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  ARKESEL_KEY: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  ARKESEL_URL: string;

  @IsString()
  @IsNotEmpty()
  SMS_SENDER_ID: string;

  @IsNumber()
  @IsPositive()
  PORT: number;

  @IsNumber()
  @IsPositive()
  REDIS_PORT: number;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvValidation, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors?.length > 0) {
    throw new Error(errors?.toString());
  }
  return validatedConfig;
};
