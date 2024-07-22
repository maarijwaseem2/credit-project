import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from './entities/borrower.entity';
import { PersonalAsset } from './entities/personal-asset.entity';
import { PrivateLoan } from './entities/private-loan.entity';
import { BorrowerService } from './borrower.service';
import { BorrowerController } from './borrower.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Borrower, PersonalAsset, PrivateLoan])],
  providers: [BorrowerService],
  controllers: [BorrowerController],
})
export class BorrowerModule {}
