import { IsString, IsNumber } from 'class-validator';

export class CreatePrivateLoanDto {
  @IsString()
  description: string;

  @IsNumber()
  value: number;
}
