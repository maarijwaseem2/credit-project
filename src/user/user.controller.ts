import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegistrationDto } from './dto/create-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userRegistrationDto: UserRegistrationDto) {
    return this.userService.registerUser(userRegistrationDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() userUpdateDto: UserUpdateDto) {
    return this.userService.updateUser(id, userUpdateDto);
  }
}
