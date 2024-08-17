import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, IsString } from 'class-validator';

export class FilmDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    director: string;

    @IsNumber()
    @Transform(({ value }) => { return Number(value); })
    release_year: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    genre: string[];

    @IsNumber()
    @Transform(({ value }) => { return Number(value); })
    price: number;

    @IsNumber()
    @Transform(({ value }) => { return Number(value); })
    duration: number;
}
