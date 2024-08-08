import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../userRole.enum';
import { errorMessages } from 'src/shared/constant/constant';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([UserRole.Admin, UserRole.User], {
    message: errorMessages.role,
  })
  role: UserRole;
}
