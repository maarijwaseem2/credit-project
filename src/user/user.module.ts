import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: 'credit',
      port: 3306,
      username: "root",
      password: "",
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    NestjsFormDataModule,

  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
