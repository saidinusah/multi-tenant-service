import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';

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
