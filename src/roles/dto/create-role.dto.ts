import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateRoleDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
}
