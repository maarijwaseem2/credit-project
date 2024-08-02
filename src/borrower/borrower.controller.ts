import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BorrowerService } from './borrower.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { Borrower } from './entities/borrower.entity';

@Controller('borrower')

export class BorrowerController {
  constructor(private readonly borrowerService: BorrowerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBorrowerDto: CreateBorrowerDto): Promise<{ message: string, borrower: Borrower }> {
    return this.borrowerService.create(createBorrowerDto);
  }

  @Get()
  async findAll(): Promise<{ message: string, borrowers: Borrower[] }> {
    return this.borrowerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ message: string, borrower: Borrower }> {
    return this.borrowerService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBorrowerDto: UpdateBorrowerDto): Promise<{ message: string, borrower: Borrower }> {
    return this.borrowerService.update(id, updateBorrowerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.borrowerService.remove(id);
  }
}