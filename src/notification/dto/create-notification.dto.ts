import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}