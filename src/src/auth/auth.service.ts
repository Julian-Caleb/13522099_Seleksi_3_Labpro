import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { LoginUserDto } from './dtos/login.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    if (username === 'admin' && password === 'admin123') {
      const token = this.generateToken({sub: 0, username: 'admin'});
      return {
        status: 'success',
        message: 'Admin login successful',
        data: {
          username: 'admin',
          token: token.access_token,
        },
      };
    } else {
      return {
        status: 'error',
        message: 'Invalid credentials',
        data: null,
      };
    }
  }

  async registerUser(registerDto: RegisterDto) {
    const { email, password, username, firstName, lastName } = registerDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already in use');
    }

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

 async loginUser(loginDto: LoginUserDto) {
    const { usernameOrEmail, password } = loginDto;
    let found = false;

    let user = await this.prisma.user.findUnique({
      where: { 
        username: usernameOrEmail 
      },
    });
    if (user && await argon2.verify(user.password, password)) {
      found = true;
    } else {
      user = await this.prisma.user.findUnique({
        where: { 
          email: usernameOrEmail 
        },
      });
      if (user && await argon2.verify(user.password, password)) {
        found = true;
      };
    }

    if (found) {
      const token = this.generateToken(user);
      return {
          status: 'success',
          message: 'Login successful',
          data: {
              username: user.username,
              token: token.access_token,
          },
      };
    } else {
      return {
        status: 'error',
        message: 'Login failed',
        data: null,
      };
    }
}


  private generateToken(user: any) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
