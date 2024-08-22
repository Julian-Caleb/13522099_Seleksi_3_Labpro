/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs';
import path from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

class Seeder {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  
  constructor(
      private readonly jwtService: JwtService,
      private readonly prisma: PrismaService,
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

  private async createUser(data: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    balance: number;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  private async createFilm(data: {
    title: string;
    description: string;
    director: string;
    release_year: number;
    genre: string[];
    price: number;
    duration: number;
    video_url: string;
    cover_image_url: string;
  }) {
    return this.prisma.film.create({
      data,
    });
  }

  async seed() {

    const hashedPassword = await argon2.hash("Password");
    const user1 = await this.createUser({
        email: 'username@gmail.com',
        username: 'Username',
        firstName: 'User',
        lastName: 'Name',
        password: hashedPassword, 
        balance: 5000,
    });

    console.log("User1 successfully created.");
    
    const film1 = await this.createFilm({
      title: 'Indonesian Folk Music Medley - hololive ID [Cover]',
      description: 'Happy August 17th, everyone! Indonesia was not formed by one language and sound. Indonesia is diversed. However, the diversity itself help creates a beautiful and clear harmony! Presented by 6 talents from hololive Indonesia, this is Indonesian folk music medley that you all have been waiting for! #holoIDberbudaya',
      director: 'Hololive Indonesia',
      release_year: 2021,
      genre: ['Music', 'Vtuber', 'Indonesia'],
      price: 1500,
      duration: 158,
      video_url: `https://${this.bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/video1.mp4`,
      cover_image_url: `https://${this.bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/image1.png`,
    });

    console.log("Film1 successfully created.");

    const film2 = await this.createFilm({
      title: 'Indonesian Folk Music Medley 2024 Ver. - hololive ID [Cover]',
      description: 'Hello from Indonesia! Indonesia is comprised of diverse cultures and languages. From Sabang to Merauke, each region has its own unique characteristics. The diversity of languages, dances, music, and traditions come together in a harmonious unity. Presented by 9 talents of hololive Indonesia, this is the medley of folk songs in Indonesia that you have been waiting for! #holoIDJiwaKarya',
      director: 'Hololive Indonesia',
      release_year: 2024,
      genre: ['Music', 'Vtuber', 'Indonesia'],
      price: 2000,
      duration: 541,
      video_url: `https://${this.bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/video2.mp4`,
      cover_image_url: `https://${this.bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/image2.png`,
    });

    console.log("Film2 successfully created.");

    console.log("Seeding completed");

  }
}

async function main() {
    const configService = new ConfigService();
    const prismaService = new PrismaService(configService);
    const jwtService = new JwtService();
  
    const seeder = new Seeder(jwtService, prismaService);
    await seeder.seed();
}
  
main()
.catch((e) => {
    console.error(e);
    process.exit(1);
});