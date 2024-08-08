import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller ('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // Endpoint register
    @HttpCode(HttpStatus.OK)
    @Post('register')
    register(@Body() dto: AuthDto) {
        return this.authService.register(dto);
    }

    // Endpoint signin
    @Post('login')
    login(@Body() dto: AuthDto){
        return this.authService.login(dto);
    }

    
}