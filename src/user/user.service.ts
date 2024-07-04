import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRegistrationDto } from './dto/create-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async registerUser(userRegistrationDto: UserRegistrationDto): Promise<User> {
    const { name, email, password, confirmPassword } = userRegistrationDto;

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password; // You should hash the password before saving it

    return this.userRepository.save(user);
  }

  async updateUser(id: number, userUpdateDto: UserUpdateDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    const { name, email, phone, profilePic, password, confirmPassword } = userUpdateDto;

    if (password && password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (profilePic) {
      const filePath = path.join(__dirname, '../../uploads', profilePic.originalName);
      fs.copyFileSync(profilePic.path, filePath);
      user.profilePic = filePath;
    }
    if (password) user.password = password; // You should hash the password before saving it

    return this.userRepository.save(user);
  }
}