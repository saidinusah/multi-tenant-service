import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
} from "class-validator";
import { REGEXES } from "src/utils/constants";

export class CreateOrganizationDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(REGEXES.GHANA_POST_GPS, {
    message: "Please enter a valid Ghana Post GPS code",
  })
  ghanaPostGPS: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber("GH")
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;
}
