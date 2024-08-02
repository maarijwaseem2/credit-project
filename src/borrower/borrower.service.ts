import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Borrower } from './entities/borrower.entity';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { PersonalAsset } from './entities/personal-asset.entity';
import { PrivateLoan } from './entities/private-loan.entity';
import { borrowerMessage } from 'src/shared/constant/constant';

@Injectable()
export class BorrowerService {
  constructor(
    @InjectRepository(Borrower)
    private readonly borrowerRepository: Repository<Borrower>,
  ) {}

  async create(createBorrowerDto: CreateBorrowerDto): Promise<{ message: string, borrower: Borrower }> {
    const { email } = createBorrowerDto;

    const existingEmail = await this.borrowerRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    try {
      const borrower = this.borrowerRepository.create(createBorrowerDto);
      await this.borrowerRepository.save(borrower);
      return { message: borrowerMessage.borrowerCreate, borrower };
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new UnprocessableEntityException('Missing required fields');
      }
      throw error;
    }
  }

  async findAll(): Promise<{ message: string, borrowers: Borrower[] }> {
    const borrowers = await this.borrowerRepository.find({ relations: ['personalAssets', 'privateLoans'] });
    return { message: borrowerMessage.allBorrowerFetched, borrowers };
  }

  async findOne(id: string): Promise<{ message: string, borrower: Borrower }> {
    const borrower = await this.borrowerRepository.findOne({where:{id}, relations: ['personalAssets', 'privateLoans'] });
    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }
    return { message: borrowerMessage.borrowerFetched, borrower };
  }

  async update(id: string, updateBorrowerDto: UpdateBorrowerDto): Promise<{ message: string, borrower: Borrower }> {
    const borrower = await this.findOne(id);

    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }

    const { personalAssets, privateLoans, ...borrowerData } = updateBorrowerDto;

    return await this.borrowerRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      await transactionalEntityManager.update(Borrower, id, borrowerData);

      if (personalAssets) {
        await transactionalEntityManager.delete(PersonalAsset, { borrower });
        const newPersonalAssets = personalAssets.map(asset => ({
          ...asset,
          borrower: { id }, 
        }));
        await transactionalEntityManager.save(PersonalAsset, newPersonalAssets);
      }

      if (privateLoans) {
        await transactionalEntityManager.delete(PrivateLoan, { borrower });
        const newPrivateLoans = privateLoans.map(loan => ({
          ...loan,
          borrower: { id }, 
        }));
        await transactionalEntityManager.save(PrivateLoan, newPrivateLoans);
      }

      const updatedBorrower = await this.findOne(id);
      return { message: borrowerMessage.borrowerUpdate, borrower: updatedBorrower.borrower };
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    const borrower = await this.findOne(id);
    if (!borrower) {
      throw new NotFoundException('Borrower not found');
    }
    await this.borrowerRepository.manager.transaction(async (transactionalEntityManager: EntityManager) => {
      await transactionalEntityManager.delete(PersonalAsset, { borrower: { id } });
      await transactionalEntityManager.delete(PrivateLoan, { borrower: { id } });
      await transactionalEntityManager.delete(Borrower, id);
    });
    return { message: borrowerMessage.borrowerDelete};
  }
}
