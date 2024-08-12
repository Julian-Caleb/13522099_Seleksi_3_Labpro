import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async self(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
        
            if (!user) {
                throw new UnauthorizedException();
            } 

            return {
                status: 'success',
                message: 'User retrieved successfully',
                data: {
                username: user.username,
                token,
                },
            };
          
        } catch (error) {
            return {
                status: 'error',
                message: 'Failed to retrieve user',
                data: null,
            };
        }
      }

    async users(q?: string) {
        const users = await this.prisma.user.findMany({
            where: q ? { username: { contains: q } } : {},
        });
      
        return {
            status: 'success',
            message: 'Users retrieved successfully',
            data: users,
        };
    }

    

}
