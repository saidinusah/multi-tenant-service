import { IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class RequestOTP {
  @IsString()
  @IsPhoneNumber("GH")
  phoneNumber: string;
}

export class VerifyOTP {
  @IsString()
  @IsPhoneNumber("GH")
  phoneNumber: string;

  @IsString()
  @IsString()
  @MaxLength(6)
  @MinLength(6)
  code: string;
}
