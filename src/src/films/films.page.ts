import { Controller, Get, Param, Req, Render, Query, Post, Res, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { FilmsService } from "./films.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Controller()
export class FilmsPageController {
    constructor(
        private readonly filmService: FilmsService,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    @Get('films-page')
    @Render('films/films')
    async renderFilmsPage(
        @Req() req: Request, 
        @Query('q') q?: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '3'
    ) {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        let result: any;

        const token = req.cookies ? req.cookies['token'] : null;
        const loggedIn = !!token;
        

        if (loggedIn) {
            result = await this.filmService.films("Bearer " + token, q);
        } else {
            result = await this.filmService.publicFilms(q);
        }

        const films = result.data;
        const totalFilms = films.length;
        const totalPages = Math.ceil(totalFilms / limitNumber);

        const paginatedFilms = films.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);

        return {
            layout: 'layout',
            films: paginatedFilms,
            currentPage: pageNumber,
            totalPages,
            query: q,
        };
    }

    @Get('film-detail-page/:id')
    @Render('films/film-detail')
    async renderFilmDetailPage(
        @Req() req: Request,
        @Param('id') id: string
    ) {
        const token = req.cookies ? req.cookies['token'] : null;
        const loggedIn = !!token;
    
        let film: any;
        let isBought = false;
    
        if (loggedIn) {
            film = await this.filmService.filmId("Bearer " + token, id);
    
            const decoded = this.jwtService.verify(token);
            const userId = decoded.sub;
    
            isBought = await this.prisma.filmOnUser.findUnique({
                where: { userId_filmId: { userId, filmId: id } },
            }) !== null;
        } else {
            film = await this.filmService.publicFilmId(id);
        }
    
        return {
            layout: 'layout',
            film: film.data,
            loggedIn,
            isBought,
        };
    }
    

    @Post('back-home-btn-redirect')
    backHome(@Res() res: Response) {
        return res.redirect('/home-page');
    }

    @Post('buy-film-btn/:id')
    async buyFilm(
        @Req() req: Request,
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const token = req.cookies ? req.cookies['token'] : null;
        const loggedIn = !!token;

        if (!loggedIn) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        try {

            const result = await this.filmService.processPayment("Bearer " + token, id);
            
            if (result) {
                return res.redirect('/films-page');
            } else {
                throw new HttpException('Insufficient balance', HttpStatus.PAYMENT_REQUIRED);
            }
        } catch (error) {
            throw new HttpException('Payment Failed', HttpStatus.BAD_REQUEST);
        }

    }

    @Get('my-list-page')
    @Render('films/my-list')
    async renderMyList(
        @Req() req: Request,
        @Query('q') q?: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '3'
    ) {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        let result: any;

        const token = req.cookies ? req.cookies['token'] : null;
        const loggedIn = !!token;
        
        if (loggedIn) {
            const decoded = this.jwtService.verify(token);
            const userId = decoded.sub;

            result = await this.filmService.purchasedFilms(userId, q);
            
            const films = result.data;
            const totalFilms = films.length;
            const totalPages = Math.ceil(totalFilms / limitNumber);

            const paginatedFilms = films.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);

            return {
                layout: 'layout',
                films: paginatedFilms,
                currentPage: pageNumber,
                totalPages,
                query: q,
            };
        } else {
            return {
                layout: 'layout',
                films: [],
                currentPage: 1,
                totalPages: 0,
                query: q,
            };
        }
    }

    @Post('back-films-btn-redirect')
    backFilms(@Res() res: Response) {
        return res.redirect('/films-page');
    }

    @Get('films/watch/:id')
    @Render('films/watch')
    async watchFilm(
        @Req() req: Request,
        @Param('id') id: string
    ) {
        const token = req.cookies ? req.cookies['token'] : null;
        const loggedIn = !!token;

        if (loggedIn) {
            const result = await this.filmService.getFilmVideo("Bearer " + token, id);

            return {
                layout: 'layout',
                videoUrl: result.data.videoUrl,
                filmId: id,
            }
        
        } else {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

    }

    @Post('back-film-detail-btn-redirect/:id')
    backFilmDetail(@Res() res: Response, @Param('id') id: string) {
        return res.redirect(`/film-detail-page/${id}`);
    }


}
