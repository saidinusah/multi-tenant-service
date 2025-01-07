import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsPhoneNumber("GH")
  phoneNumber: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UserRoles)
  roles: UserRoles[];

  toDatabaseModel() {
    return {
      title: this.title,
      phone_number: this.phoneNumber,
      last_name: this.lastName,
    };
  }
}

export class UserRoles {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsNumber()
  @IsPositive()
  id: number;
}
