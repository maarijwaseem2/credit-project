import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePersonalAssetDto } from './create-personal-asset.dto';
import { CreatePrivateLoanDto } from './create-private-loan.dto';

export class CreateBorrowerDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  occupation: string;

  @IsString()
  sin: string;

  @IsNumber()
  annualIncome: number;

  @IsNumber()
  amountBorrowed: number;

  @IsNumber()
  interestRate: number;

  @IsNumber()
  term: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePersonalAssetDto)
  personalAssets: CreatePersonalAssetDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrivateLoanDto)
  privateLoans: CreatePrivateLoanDto[];
}
