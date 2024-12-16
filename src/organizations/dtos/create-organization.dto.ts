import {
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateOrganizationDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  ghanaPostGPS: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('GH')
  phoneNumber: string;

  @IsEmail()
  email?: string;

  remappedForWriting() {
    return {
      phone_number: this.phoneNumber,
      email: this.email,
      ghana_post_gps: this.ghanaPostGPS,
      name: this.name,
    };
  }
}
