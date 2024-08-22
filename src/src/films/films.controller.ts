import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UploadedFiles, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { FilmDto } from "./dtos";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Films')
@Controller()
export class FilmsController {
    constructor(private readonly filmService: FilmsService) {}

    @Post('films')
    @UseInterceptors(FileFieldsInterceptor([
            { name: 'video', maxCount: 1 },
            { name: 'cover_image', maxCount: 1 },
        ])
    )
    async createFilm(
        @Headers('Authorization') header: string,
        @Body() film: FilmDto,
        @UploadedFiles() files: { video: Express.Multer.File[], cover_image?: Express.Multer.File[] },
    ) {
        return this.filmService.createFilm(header, film, files.video[0], files.cover_image[0]);
    }

    @Get('films')
    async films(
        @Headers('Authorization') header: string,
        @Query('q') q?: string
    ) {
        return this.filmService.films(header, q);
    }

    @Get('public-films')
    async publicFilms(
        @Query('q') q?: string
    ) {
        return this.filmService.publicFilms(q);
    }

    @Get('films/:id')
    async filmId(
        @Headers('Authorization') header: string,
        @Param('id') id: string
    ) {
        return this.filmService.filmId(header, id);
    }

    @Get('films/:id')
    async publicFilmId(
        @Param('id') id: string
    ) {
        return this.filmService.publicFilmId(id);
    }

    @Put('films/:id')
    @UseInterceptors(FileFieldsInterceptor([
            { name: 'video', maxCount: 1 },
            { name: 'cover_image', maxCount: 1 },
        ])
    )
    async updateFilm(
        @Headers('Authorization') header: string,
        @Body(ValidationPipe) film: FilmDto,
        @UploadedFiles() files: { video?: Express.Multer.File, cover_image?: Express.Multer.File },
        @Param('id') id: string,
    ) {
        return this.filmService.updateFilm(header, film, files.video, files.cover_image, id);
    }

    @Delete('films/:id')
    async deleteFilm(
        @Headers('Authorization') header: string,
        @Param('id') id: string
    ) {
        return this.filmService.deleteFilm(header, id);
    }

}
