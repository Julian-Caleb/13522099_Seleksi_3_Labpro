import { Body, Controller, Delete, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('self')
    async self(@Headers('Authorization') header: string) {
      return this.usersService.self(header);
    }

    @Get('self-user')
    async selfUser(@Headers('Authorization') header: string) {
      return this.usersService.selfUser(header);
    }

    @Get('users')
    async users(@Headers('Authorization') header: string, @Query('q') q?: string) {
      return this.usersService.users(header, q);
    }

    @Get('users/:id')
    async userId(@Headers('Authorization') header: string, @Param('id') id: string,) {
      return this.usersService.users(header, id);
    }

    @Post('users/:id/balance')
    async balance(@Headers('Authorization') header: string, @Body('increment') increment: number, @Param('id') id: string) {
      return this.usersService.balance(header, increment, id);
    }

    @Delete('users/:id')
    async delete(@Headers('Authorization') header: string, @Param('id') id: string) {
      return this.usersService.delete(header, id);
    }

}

