import { Controller, Post, Body, Param, Patch, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './file-upload.middleware';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async register(@Body() userRegistrationDto: CreateUserDto) {
    return this.userService.registerUser(userRegistrationDto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('upload_cover_image', multerOptions))
  async update( @Param('id', ParseUUIDPipe) id: string, @Body() userUpdateDto: UserUpdateDto, @UploadedFile() file) {
    return await this.userService.updateUser(id, userUpdateDto, file);
  }
}
