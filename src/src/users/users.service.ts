import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async self(header: string) {
        try {
            if (!header || !header.startsWith('Bearer ')) {
                throw new UnauthorizedException("Invalid token");
            }
            const token = header.split(' ')[1];

            return {
                status: 'success',
                message: 'Admin retrieved successfully',
                data: {
                    username: 'admin',
                    token,
                },
            };
          
        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null,
            };
        }
    }

    async selfUser(header: string) {
        try {
            if (!header || !header.startsWith('Bearer ')) {
                throw new UnauthorizedException("Invalid token");
            }
            const token = header.split(' ')[1];

            const decoded = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
        
            if (!user) {
                throw new UnauthorizedException("User not found.");
            } 

            return {
                status: 'success',
                message: 'User retrieved successfully',
                data: {
                    username: user.username,
                    balance: user.balance,
                    token,
                },
            };
          
        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null,
            };
        }
    }

    async users(header: string, q?: string) {
        try {
            if (!header || !header.startsWith('Bearer ')) {
                throw new UnauthorizedException('Invalid token.');
            }

            const users = await this.prisma.user.findMany({
                where: {
                    username: {
                        contains: q,
                    },
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    balance: true,
                },
            });
        
            if (!users) {
                throw new UnauthorizedException("Failed to retrieve users.");
            } 

            return {
                status: 'success',
                message: 'Users retrieved successfully',
                data: users,
            };

        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: [],
            };
        }
    }

    async userId(header: string, id: string) {
        try {
            if (!header || !header.startsWith('Bearer ')) {
                throw new UnauthorizedException("Invalid token.");
            }

            const user = await this.prisma.user.findUnique(
                {
                    where: { id },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        balance: true,
                },
            });

            if (!user) {
                throw new NotFoundException("Failed to retrieve user.");
            } 
        
            return {
                status: 'success',
                message: 'User retrieved successfully',
                data: user,
            };

        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null,
            };
        }
    }

    async balance(header: string, increment: number, id: string) {
        try {
            if (!header || !header.startsWith('Bearer ')) {
                throw new UnauthorizedException("Invalid token.");
            }

            const user = await this.prisma.user.findUnique({ where: { id } });

            if (!user) {
                throw new UnauthorizedException("Failed to retrieve user.");
            }

            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                  balance: {
                    increment,
                  },
                },
                select: {
                  id: true,
                  username: true,
                  email: true,
                  balance: true,
                },
              });

              return {
                status: 'success',
                message: 'User balance updated successfully',
                data: updatedUser,
              };

        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null,
            };
        }
    }

    async delete(header: string, id: string) {
        try {
            if (!header || !header.startsWith('Bearer ')) {
                throw new UnauthorizedException("Invalid token.");
            }
    
            const user = await this.prisma.user.findUnique({ where: { id } });
    
            if (!user) {
                throw new UnauthorizedException("Failed to retrieve user.");
            }
    
            await this.prisma.filmOnUser.deleteMany({
                where: { userId: id },
            });
    
            const deletedUser = await this.prisma.user.delete({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    balance: true,
                },
            });
    
            return {
                status: 'success',
                message: 'User and related films deleted successfully',
                data: deletedUser,
            };
    
        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: null,
            };
        }
    }
    

}
