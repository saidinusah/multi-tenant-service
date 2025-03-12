import { IsNotEmpty, IsString } from "class-validator";

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

export class AdminLogin {
  email: string;
  password: string;
}
