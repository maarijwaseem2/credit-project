import { IsNotEmpty, IsString, } from 'class-validator';

export class UpdateNotificationDto {

  @IsNotEmpty()
  @IsString()
  status: string;
}