import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilmsModule } from './films/films.module';
import { AppPageController } from './app.page';
import { UsersService } from './users/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    FilmsModule,
  ],
  controllers:[AppPageController],
  providers: [PrismaService, UsersService],
})
export class AppModule {}
