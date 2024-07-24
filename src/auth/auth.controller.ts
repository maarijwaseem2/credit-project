import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { ForgotPasswordRequestDto } from './dto/login-auth.dto';
import { ResetPasswordRequestDto } from './dto/login-auth.dto';
import { VerifyEmailDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { AdminGuard } from 'src/shared/guards/admin-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }
  
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordRequestDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordRequestDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<any> {
    const { email, password } = verifyEmailDto;
    return this.authService.verifyEmail(email, password);
  }
}