/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/users.entity';
import { LoginDto } from './dto/login.dto';
import { HashService } from 'src/helper/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(phoneNumber: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(phoneNumber);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserByRefreshToken(token: string): Promise<any> {
    const user = await this.usersService.findOne(token);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginDto) {
    const _user = await this.usersService.findOne(user.phone_number);
    if (!_user) {
      return new UnauthorizedException();
    }
    const hash = new HashService(this.configService);
    if (!hash.comparePassword(user.password, _user.password)) {
      return new UnauthorizedException();
    }
    return await this.getUserWithToken(_user);
  }

  async refresh(user: any) {
    return await this.getUserWithToken(user);
  }

  private async getUserWithToken(user: User): Promise<any> {
    const payload = { id: user.id, phone_number: user.phone_number };
    const [token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
        expiresIn: '2h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    const { password, ..._user } = await this.usersService.updateRefreshToken(
      user.id,
      refresh_token,
    );
    _user.access_token = token;
    return _user;
  }
}
