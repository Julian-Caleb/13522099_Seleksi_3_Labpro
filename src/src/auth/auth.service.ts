import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, username, firstName, lastName } = registerDto;
    const hashedPassword = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        firstName,
        lastName,
        balance: 0,
      },
    });

    const token = this.generateToken(user);

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        username: user.username,
        token: token.access_token,
      },
    };

  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user || !(await argon2.verify(user.password, password))) {
      // console.log("Failed");
      return {
        status: 'error',
        message: 'Login failed',
        data: null,
      }
    } else {
      const token = this.generateToken(user);
      // console.log("Success");
      return {
        status: 'success',
        message: 'Login successful',
        data: {
          username: user.username,
          token: token.access_token,
        },
      };
    }
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
