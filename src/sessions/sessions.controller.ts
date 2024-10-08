import { Body, Controller, Get, Post } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {

    constructor(private readonly sessionsService: SessionsService) {}

    @Post('connect-session')
    async connectSession(@Body() data: any) {
        const { host, port, username, password, title } = data;

        const response = await this.sessionsService.create({
            host,
            port,
            username,
            password,
            title
        });

        return {
            ...response
        };

    }

    @Get('list')
    async list() {
        return await this.sessionsService.list();
    }

    // @Get('list-running')
    // listRunning() {
    //     return this.sessionsService.listRunning();
    // }
}
