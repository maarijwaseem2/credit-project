import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor( private readonly authService: AuthService) {
      super({
        usernameField: 'email',
      });
  } 
  
  async validate(email: string, password: string) {
    try {
      return await this.authService.validateUser(email, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}