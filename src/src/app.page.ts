import { Controller, Get, Post, Render, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { UsersService } from "./users/users.service";

@Controller()
export class AppPageController {
    constructor(private readonly usersService: UsersService) {}

    @Get('home-page')
    @Render('home')
    async homePage(
        @Req() req: Request, 
    ) {
        const token = req.cookies['token'];
        const loggedIn = !!token;

        if (loggedIn) {
            const result = await this.usersService.selfUser("Bearer " + token);
            return {
                layout: 'layout',
                username: result.data.username,
                balance: 'Your balance is ' + result.data.balance + '.',
                loggedIn,
            }
        } else {
            return {
                layout: 'layout',
                username: 'Guest',
                balance: null,
                loggedIn,
            }
        }
    }

    @Post('logout-btn')
    logout(@Res() res: Response) {
        res.clearCookie('token');
        return res.redirect('/home-page');
    }

    @Post('login-btn-redirect')
    login(@Res() res: Response) {
        return res.redirect('/login-page');
    }

    @Post('films-btn-redirect')
    films(@Res() res: Response) {
        return res.redirect('/films-page');
    }

    @Post('my-list-btn-redirect')
    myList(@Res() res: Response) {
        return res.redirect('/my-list-page');
    }


}