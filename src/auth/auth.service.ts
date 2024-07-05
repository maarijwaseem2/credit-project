import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LenderLoginRequestDto } from './dto/login-auth.dto';
import { ForgotPasswordRequestDto } from './dto/login-auth.dto';
import { ResetPasswordRequestDto } from './dto/login-auth.dto';
import { VerifyEmailDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(loginDto: LenderLoginRequestDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // Generate token or any other login logic
    return {
      statusCode: 200,
      messages: ['Lender logged in successfully'],
      data: {
        user,
        // token,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordRequestDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Send reset email logic

    return {
      statusCode: 200,
      messages: ['Reset email has been sent successfully. Kindly check email'],
      data: [],
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordRequestDto) {
    const { newPassword, confirmNewPassword } = resetPasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new ConflictException("Passwords don't match");
    }

    // Update password logic

    return {
      statusCode: 201,
      messages: ['Password updated successfully'],
      data: [],
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, verificationCode } = verifyEmailDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.verificationCode !== verificationCode) {
      throw new BadRequestException('Bad request');
    }

    // Verify email logic

    return {
      statusCode: 202,
      messages: ['Email verified successfully'],
      data: [],
    };
  }
}
