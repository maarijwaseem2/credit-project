import { IsString, IsNumber } from 'class-validator';

export class CreatePersonalAssetDto {
  @IsString()
  description: string;

  @IsNumber()
  value: number;
}
