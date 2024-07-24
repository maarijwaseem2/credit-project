import * as bodyParser from 'body-parser'
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AdminGuard } from './shared/guards/admin-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import * as multer from 'multer';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { ResponseInterceptor } from './shared/interceptor/response.interceptor';
import { LocalAuthGuard } from './shared/guards/local-auth.guard';
global.fetch = require('node-fetch');
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule,{
    bodyParser: true,
});
await app.init();
app.enableCors();
const reflector = app.get(Reflector);
  const adminGuard = new AdminGuard(reflector);
  app.use(multer)
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.text({type: 'text/html'}))
  app.use(bodyParser.json())
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(adminGuard);
  app.useGlobalGuards(new LocalAuthGuard());
  app.useGlobalGuards(new JwtAuthGuard());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3000);
}
bootstrap();