import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  isRead: boolean;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}