import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LenderLoginRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsNotEmpty()
    password: string;
  }

  export class ForgotPasswordRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  }

  export class ResetPasswordRequestDto {
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
  
    @IsNotEmpty()
    @MinLength(6)
    confirmNewPassword: string;
  }

  export class VerifyEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsNotEmpty()
    verificationCode: string;
  }