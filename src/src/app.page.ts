import { Controller, Get, Post, Render, Req, Res, Body } from "@nestjs/common";
import { Request, Response } from "express";
import { UsersService } from "./users/users.service";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class AppPageController {
    constructor(private readonly usersService: UsersService) {}

    @ApiTags('Render')
    @Get('home-page')
    @Render('home')
    async homePage(@Req() req: Request) {
        const token = req.cookies['token'];
        const loggedIn = !!token;
        const menuOpen = req.cookies['menuOpen'] === 'true';

        if (loggedIn) {
            const result = await this.usersService.selfUser("Bearer " + token);
            return {
                layout: 'layout',
                username: result.data.username,
                balance: 'Your balance is ' + result.data.balance + '.',
                loggedIn,
                menuOpen,
            };
        } else {
            return {
                layout: 'layout',
                username: 'Guest',
                balance: null,
                loggedIn,
                menuOpen,
            };
        }
    }

    @ApiTags('Button')
    @Post('logout-btn')
    logout(@Res() res: Response) {
        res.clearCookie('token');
        return res.redirect('/home-page');
    }

    @ApiTags('Button')
    @Post('login-btn-redirect')
    login(@Res() res: Response) {
        return res.redirect('/login-page');
    }

    @ApiTags('Button')
    @Post('toggle-menu')
    toggleMenu(@Req() req: Request, @Res() res: Response, @Body('menuOpen') menuOpen: boolean) {
        res.cookie('menuOpen', menuOpen);
        return res.sendStatus(200);
    }
}
