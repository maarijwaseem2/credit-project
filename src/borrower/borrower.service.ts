import { Injectable } from '@nestjs/common';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';

@Injectable()
export class BorrowerService {
  create(createBorrowerDto: CreateBorrowerDto) {
    return 'This action adds a new borrower';
  }

  findAll() {
    return `This action returns all borrower`;
  }

  findOne(id: number) {
    return `This action returns a #${id} borrower`;
  }

  update(id: number, updateBorrowerDto: UpdateBorrowerDto) {
    return `This action updates a #${id} borrower`;
  }

  remove(id: number) {
    return `This action removes a #${id} borrower`;
  }
}
