import { Module } from '@nestjs/common';
import { BorrowerService } from './borrower.service';
import { BorrowerController } from './borrower.controller';

@Module({
  controllers: [BorrowerController],
  providers: [BorrowerService],
})
export class BorrowerModule {}
