import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from './public.guard';
import { RefreshTokenGuard } from './guard/refresh.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @Public()
  @Post('login')
  async login(@Body() login: LoginDto) {
    try {
      const user = await this.authService.login(login);
      return user;
    } catch (error) {
      return new UnauthorizedException();
    }
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Public()
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }
}
