import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService){}

  async validateUser(email: string, password: string) {
    let user = await this.userService.findByEmail(email);
    // User not found
    if (!user) {
      throw new BadRequestException("Wrong credentials");
    }
    // Compare password
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    delete(user.password);
    return user;
  };

  login(user: any) {
    const payload = {email: user.email, sub: user.id};
    return {access_token: this.jwtService.sign(payload)};
  }

  register(registerDto: RegisterDto) {
    return this.userService.create(<Prisma.UserCreateInput>registerDto);
  }
}
