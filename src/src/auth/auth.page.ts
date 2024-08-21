import { Body, Controller, Get, HttpStatus, Post, Render, Res } from "@nestjs/common";
import { AuthService } from './auth.service'
import { LoginUserDto } from "./dtos/login.user.dto";
import { Response } from "express";
import { RegisterDto } from "./dtos";

@Controller()
export class AuthPageController {
    constructor(private readonly authService: AuthService) {}

    @Get('register-page')
    @Render('auth/register')
    registerPage() {
        return {
            layout: 'layoutNonPartial',
        };
    }

    @Get('login-page')
    @Render('auth/login')
    loginPage() {
        return {
            layout: 'layoutNonPartial',
        };
    }

    @Post('login-btn')
    async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        const result = await this.authService.loginUser(loginUserDto);
        if (result.status === 'success') {
            res.cookie('token', result.data.token, { httpOnly: true });
            return res.redirect('/home-page');
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json(result);
        }
    }

    @Post('register-btn')
    async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
        const result = await this.authService.registerUser(registerDto);
        if (result.status === 'success') {
            res.cookie('token', result.data.token, { httpOnly: true });
            return res.redirect('/home-page');
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json(result);
        }
    }

}
