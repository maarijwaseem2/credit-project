import { IsNotEmpty, } from 'class-validator';

export class UpdateNotificationDto {

  @IsNotEmpty()
  isRead: boolean;
}