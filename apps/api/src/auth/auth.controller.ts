import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!session) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { access_token } = await this.authService.login(session);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 3600000, // 1h
    });

    return {
      message: 'Login successful',
      user: {
        id: session.user.id,
        email: session.user.email,
      },
    };
  }
}
