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

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '5h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

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

    const tokens = await this.generateTokens(user);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return tokens;
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET || "secret-code-jwt",
      });

      const user = await this.usersService.findByEmailWithPassword(payload.email);

      if(!user || !user.refreshToken) {
        throw new UnauthorizedException("Access denied");
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if(!isRefreshTokenValid) {
        throw new UnauthorizedException("Access denied");
      }

      const tokens = await this.generateTokens(user);

      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

      await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

      return tokens;

    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);

    return {
      message: "Logged out successfully",
    }
  }
}
