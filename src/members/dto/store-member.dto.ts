import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateMember {
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

export class StoreMember extends UpdateMember {
  @IsUUID()
  packageId?: string;
}
