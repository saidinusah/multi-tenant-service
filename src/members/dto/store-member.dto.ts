import { IsNotEmpty, IsString } from "class-validator";

export class StoreMember {
  @IsString()
  @IsNotEmpty()
  foreNames: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  idNumber: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
