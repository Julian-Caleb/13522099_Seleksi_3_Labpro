import { Controller, Get, Render } from "@nestjs/common";

@Controller()
export class AppPageController {

    @Get('home-page')
    @Render('home')
    homePage() {
        return {
            layout: 'layout',
        };
    }

}