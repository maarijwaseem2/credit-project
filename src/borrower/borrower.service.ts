import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Borrower } from './entities/borrower.entity';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { PersonalAsset } from './entities/personal-asset.entity';
import { PrivateLoan } from './entities/private-loan.entity';

@Injectable()
export class BorrowerService {
  constructor(
    @InjectRepository(Borrower)
    private readonly borrowerRepository: Repository<Borrower>,
    @InjectRepository(PersonalAsset)
    private readonly personalAssetRepository: Repository<PersonalAsset>,
    @InjectRepository(PrivateLoan)
    private readonly privateLoanRepository: Repository<PrivateLoan>,
  ) {}

  async create(createBorrowerDto: CreateBorrowerDto): Promise<{ message: string, borrower: Borrower }> {
    try {
      const borrower = this.borrowerRepository.create(createBorrowerDto);
      await this.borrowerRepository.save(borrower);
      return { message: 'Borrower added successfully', borrower };
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new UnprocessableEntityException('Missing required fields');
      }
      throw error;
    }
  }

  async findAll(): Promise<{ message: string, borrowers: Borrower[] }> {
    const borrowers = await this.borrowerRepository.find({ relations: ['personalAssets', 'privateLoans'] });
    return { message: 'Borrowers retrieved successfully', borrowers };
  }

  async findOne(id: string): Promise<{ message: string, borrower: Borrower }> {
    const borrower = await this.borrowerRepository.findOne({where:{id},  relations: ['personalAssets', 'privateLoans'] });
    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }
    return { message: 'Borrower retrieved successfully', borrower };
  }

  async update(id: string, updateBorrowerDto: UpdateBorrowerDto): Promise<{ message: string, borrower: Borrower }> {
    const borrower = await this.findOne(id);

    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }

    const { personalAssets, privateLoans, ...borrowerData } = updateBorrowerDto;

    return await this.borrowerRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      // Update borrower data
      await transactionalEntityManager.update(Borrower, id, borrowerData);

      // Handle personal assets updates
      if (personalAssets) {
        await transactionalEntityManager.delete(PersonalAsset, { borrower });
        const newPersonalAssets = personalAssets.map(asset => ({
          ...asset,
          borrower: { id }, // Reference the borrower's ID
        }));
        await transactionalEntityManager.save(PersonalAsset, newPersonalAssets);
      }

      // Handle private loans updates
      if (privateLoans) {
        await transactionalEntityManager.delete(PrivateLoan, { borrower });
        const newPrivateLoans = privateLoans.map(loan => ({
          ...loan,
          borrower: { id }, // Reference the borrower's ID
        }));
        await transactionalEntityManager.save(PrivateLoan, newPrivateLoans);
      }

      const updatedBorrower = await this.findOne(id);
      return { message: 'Borrower updated successfully', borrower: updatedBorrower.borrower };
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    const borrower = await this.findOne(id);

    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }

    await this.borrowerRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      await transactionalEntityManager.delete(PersonalAsset, { borrower });
      await transactionalEntityManager.delete(PrivateLoan, { borrower });
      await transactionalEntityManager.delete(Borrower, id);
    });

    return { message: 'Borrower deleted successfully' };
  }
}