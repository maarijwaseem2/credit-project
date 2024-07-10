import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BorrowerService } from './borrower.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';

@Controller('borrower')
export class BorrowerController {
  constructor(private readonly borrowerService: BorrowerService) {}

  @Post()
  create(@Body() createBorrowerDto: CreateBorrowerDto) {
    return this.borrowerService.create(createBorrowerDto);
  }

  @Get()
  findAll() {
    return this.borrowerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowerDto: UpdateBorrowerDto) {
    return this.borrowerService.update(+id, updateBorrowerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowerService.remove(+id);
  }
}
