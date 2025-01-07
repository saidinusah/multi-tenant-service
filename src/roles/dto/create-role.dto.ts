import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim()?.toUpperCase())
  name: string;
}
