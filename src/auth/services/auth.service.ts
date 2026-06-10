import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { registerDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: registerDto) {
    return this.usersService.create(dto);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    
    if(!user) {
      throw new UnauthorizedException("Invalid email")
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if(!isPasswordValid) {
      throw new UnauthorizedException("Invalid password")
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken } 
  }
}
