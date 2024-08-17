import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilmDto } from './dtos';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class FilmsService {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {
        this.s3Client = new S3Client({
            region: process.env.AWS_S3_REGION,
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    }

    async createFilm(header: string, film: FilmDto, video: Express.Multer.File, coverImage: Express.Multer.File | null) {
        try {
            if (!header || !header.startsWith('Bearer ')) {
                throw new UnauthorizedException("Invalid token.");
            }

            const videoUrl = await this.uploadToS3(video);
            const coverImageUrl = coverImage ? await this.uploadToS3(coverImage) : null;
            
            const newFilm = await this.prisma.film.create({
                data: {
                    title: film.title,
                    description: film.description,
                    director: film.director,
                    release_year: film.release_year,
                    genre: film.genre,
                    price: film.price,
                    duration: film.duration,
                    video_url: videoUrl,
                    cover_image_url: coverImageUrl,
                },
            });

            return {
                status: 'success',
                message: 'Film created successfully',
                data: {
                    id: newFilm.id,
                    title: newFilm.title,
                    description: newFilm.description,
                    director: newFilm.director,
                    release_year: newFilm.release_year,
                    genre: newFilm.genre,
                    price: newFilm.price,
                    duration: newFilm.duration,
                    video_url: newFilm.video_url,
                    cover_image_url: newFilm.cover_image_url,
                    created_at: newFilm.created_at.toISOString(),
                    updated_at: newFilm.updated_at.toISOString(),
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

    async films(header: string, q?: string) {
        try {
            if (!header || !header.startsWith('Bearer ')) {
                throw new UnauthorizedException();
            }

            const films = await this.prisma.film.findMany({
                where: q ? 
                {
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { director: { contains: q, mode: 'insensitive' } }
                    ]
                } : {},
                select: {
                    id: true,
                    title: true,
                    director: true,
                    release_year: true,
                    genre: true,
                    price: true,
                    duration: true,
                    cover_image_url: true,
                    created_at: true,
                    updated_at: true,
                }
            });

            if (!films) {
                throw new UnauthorizedException();
            } 

            return {
                status: 'success',
                message: 'Films retrieved successfully',
                data: films,
            };

        } catch (error) {
            return {
                status: 'error',
                message: 'Failed to retrieve films',
                data: null,
            };
        }
    }

    async filmId(header: string, id: string) {
        try {
            if (!header || !header.startsWith('Bearer ')) {
                throw new UnauthorizedException();
            }

            const film = await this.prisma.film.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    director: true,
                    release_year: true,
                    genre: true,
                    price: true,
                    duration: true,
                    video_url: true,
                    cover_image_url: true,
                    created_at: true,
                    updated_at: true,
                }
            });

            if (!film) {
                throw new NotFoundException('Film not found');
            }

            return {
                status: 'success',
                message: 'Film retrieved successfully',
                data: {
                    id: film.id,
                    title: film.title,
                    description: film.description,
                    director: film.director,
                    release_year: film.release_year,
                    genre: film.genre,
                    price: film.price,
                    duration: film.duration,
                    video_url: film.video_url,
                    cover_image_url: film.cover_image_url,
                    created_at: film.created_at.toISOString(),
                    updated_at: film.updated_at.toISOString(),
                },
            };

        } catch (error) {
            return {
                status: 'error',
                message: 'Failed to retrieve film',
                data: null,
            };
        }
    }

    async updateFilm(header: string, film: FilmDto, video: Express.Multer.File | null, coverImage: Express.Multer.File | null, id: string) {
        try {
          if (!header || !header.startsWith('Bearer ')) {
            throw new UnauthorizedException("Invalid token.");
          }
    
          const existingFilm = await this.prisma.film.findUnique({ where: { id } });
          if (!existingFilm) {
            throw new NotFoundException("Film not found.");
          }
    
          if (video && existingFilm.video_url) {
            await this.deleteFromS3(existingFilm.video_url);
          }
    
          if (coverImage && existingFilm.cover_image_url) {
            await this.deleteFromS3(existingFilm.cover_image_url);
          }
    
          const videoUrl = video ? await this.uploadToS3(video) : existingFilm.video_url;
          const coverImageUrl = coverImage ? await this.uploadToS3(coverImage) : existingFilm.cover_image_url;
    
          const updatedFilm = await this.prisma.film.update({
            where: { id },
            data: {
              title: film.title,
              description: film.description,
              director: film.director,
              release_year: film.release_year,
              genre: film.genre,
              price: film.price,
              duration: film.duration,
              video_url: videoUrl,
              cover_image_url: coverImageUrl,
              updated_at: new Date(),
            },
          });
    
          return {
            status: 'success',
            message: 'Film updated successfully',
            data: {
              id: updatedFilm.id,
              title: updatedFilm.title,
              description: updatedFilm.description,
              director: updatedFilm.director,
              release_year: updatedFilm.release_year,
              genre: updatedFilm.genre,
              price: updatedFilm.price,
              duration: updatedFilm.duration,
              video_url: updatedFilm.video_url,
              cover_image_url: updatedFilm.cover_image_url,
              created_at: updatedFilm.created_at.toISOString(),
              updated_at: updatedFilm.updated_at.toISOString(),
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

    async deleteFilm(header: string, id: string) {
        try {
          if (!header || !header.startsWith('Bearer ')) {
            throw new UnauthorizedException("Invalid token.");
          }
    
          const existingFilm = await this.prisma.film.findUnique({ where: { id } });
          if (!existingFilm) {
            throw new NotFoundException("Film not found.");
          }
    
          if (existingFilm.video_url) {
            await this.deleteFromS3(existingFilm.video_url);
          }
    
          if (existingFilm.cover_image_url) {
            await this.deleteFromS3(existingFilm.cover_image_url);
          }
    
          await this.prisma.film.delete({ where: { id } });
    
          return {
            status: 'success',
            message: 'Film deleted successfully',
            data: null,
          };
    
        } catch (error) {
          return {
            status: 'error',
            message: error.message,
            data: null,
          };
        }
      }

    private async uploadToS3(file: Express.Multer.File): Promise<string> {

        const fileExtension = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;

        const uploadParams = {
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
    
        await this.s3Client.send(new PutObjectCommand(uploadParams));
    
        return `https://${this.bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
    }

    private async deleteFromS3(fileUrl: string) {
        const fileName = fileUrl.split('/').pop();
    
        const deleteParams = {
          Bucket: this.bucketName,
          Key: fileName,
        };
    
        await this.s3Client.send(new DeleteObjectCommand(deleteParams));
      }

}
