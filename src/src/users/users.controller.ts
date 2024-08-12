import { Controller, Get, Headers, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('self')
    async self(@Headers('Authorization') header: string) {
      // if (!header || !header.startsWith('Bearer ')) {
      //   throw new UnauthorizedException('Invalid token');
      // }
      const token = header.split(' ')[1];
      return this.usersService.self(token);
    }

    @Get('users')
    async users(@Headers('Authorization') header: string, @Query('q') q?: string) {
      // if (!header || !header.startsWith('Bearer ')) {
      //   throw new UnauthorizedException('Invalid token');
      // }

      return this.usersService.users(q);
    }

}
