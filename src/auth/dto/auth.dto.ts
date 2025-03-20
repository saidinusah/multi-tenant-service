import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import * as bcrypt from "bcrypt";
import { IsStringsEqual } from "./custom.validation.dto";

export class SignUp {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  ghanaPostGPS: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class Login {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpAsAdmin {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsStringsEqual("password", { message: "Passwords do not match" })
  confirmPassword: string;

  @IsNotEmpty()
  foreNames: string;

  @IsNotEmpty()
  lastName: string;

  @IsPhoneNumber("GH")
  phoneNumber: string;

  async parsedData() {
    return {
      email: this.email,
      foreNames: this.foreNames,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      hash: await bcrypt.hash(this.password, 10),
    };
  }
}
