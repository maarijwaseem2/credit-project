import { BadRequestException, Injectable, NotFoundException, ValidationError } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserUpdateDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { errorMessages, userMessages } from 'src/shared/constant/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<{ message: string; data: User }> {
    const userDto = Object.assign(new CreateUserDto(), createUserDto);
    const errors: ValidationError[] = await validate(userDto);
    if (errors.length > 0) {
      const errorMessage = errors
        .map((error) => Object.values(error.constraints).join(', '))
        .join(', ');
      throw new BadRequestException(this.formatResponse(errorMessages.failed, errorMessage));
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      const errorMessage = errorMessages.invalidInput;
      throw new BadRequestException(this.formatResponse(errorMessage, errorMessage));
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });

    const savedUser = await this.userRepository.save(newUser);
    const firstWithId = await this.userRepository.findOne({
      where: { id: savedUser.id },
    });
    return this.formatResponse(userMessages.userCreate, {
      id: firstWithId.id,
      name: firstWithId.name,
      email: firstWithId.email,
      role: firstWithId.role,
    });
  }

  formatResponse(message: string, data: any): { message: string; data: User } {
    return { message, data };
  }

  formatErrorResponse(message: string, errorMessage: string): { message: string; data: any[] } {
    return { message: errorMessage, data: [] };
  }


  
  async updateUser(id: string, userUpdateDto: UserUpdateDto, file: Express.Multer.File): Promise<{ message: string; data: User }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(errorMessages.notFound);
    }
    
    const updatedFields: Partial<User> = {};
    if (userUpdateDto.name) {
      updatedFields.name = userUpdateDto.name;
    }
    if (userUpdateDto.email) {
        updatedFields.email = userUpdateDto.email;
    }
    if (userUpdateDto.phone) {
        updatedFields.phone = userUpdateDto.phone;
    }
    if (userUpdateDto.password) {
        if (userUpdateDto.password !== userUpdateDto.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }
        updatedFields.password = await bcrypt.hash(userUpdateDto.password, 10);
    }
    if (file) {
        const filePath = path.join(__dirname, '../../uploads', file.originalname);
        fs.copyFileSync(file.path, filePath);
        updatedFields.profilePic = filePath;
    }
  
    await this.userRepository.update(id, updatedFields);
    const updatedUser = await this.userRepository.findOne({
        where: { id },
    });
    return {
        message: userMessages.userUpdate,
        data: updatedUser,
    };
    }
}