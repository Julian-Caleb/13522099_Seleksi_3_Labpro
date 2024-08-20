import { Controller, Get, Render } from "@nestjs/common";
import { AuthService } from './auth.service'

@Controller()
export class AuthPageController {
    constructor(private readonly authService: AuthService) {}

    @Get('register-page')
    @Render('auth/register')
    registerPage() {
        return {
            layout: 'layout',
        };
    }

    @Get('login-page')
    @Render('auth/login')
    loginPage() {
        return {
            layout: 'layout',
        };
    }
}
