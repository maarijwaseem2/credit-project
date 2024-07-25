import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginUserDto } from './dto/login-auth.dto';
import { ForgotPasswordRequestDto } from './dto/login-auth.dto';
import { ResetPasswordRequestDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { authMessage, errorMessages, userMessages } from 'src/shared/constant/constant';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  private formatResponse(message: string, data: any) {
    return { message, data };
  }
  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      const errorMessage = errorMessages.invalidEmail;
      throw new UnauthorizedException(
        this.formatResponse(errorMessage, errorMessage),
      );
    }
    const passwordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!passwordMatch || !user) {
      const errorMessage = errorMessages.invalidPassword;
      throw new UnauthorizedException(
        this.formatResponse(errorMessage, errorMessage),
      );
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return this.formatResponse(authMessage.authLogged, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,

      token,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordRequestDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      statusCode: 200,
      messages: [authMessage.resetPassword],
      data: [],
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordRequestDto) {
    const { newPassword, confirmNewPassword } = resetPasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new ConflictException("Passwords don't match");
    }

    return {
      statusCode: 201,
      messages: [authMessage.forgetPassword],
      data: [],
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    const errorMessage = errorMessages.invalidAuth;
    throw new UnauthorizedException(
      this.formatResponse(errorMessage, errorMessage),
    );
  }
  async verifyEmail(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
