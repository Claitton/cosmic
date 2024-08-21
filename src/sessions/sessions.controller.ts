import { Body, Controller, Get, Post } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {

    constructor(private readonly sessionsService: SessionsService) {}

    @Post('connect-session')
    async connectSession(@Body() data: any) {
        const { host, port, username, password } = data;

        const response = await this.sessionsService.connect({
            host,
            port,
            username,
            password
        });

        return {
            response
        };

    }

    @Get('list')
    list() {
        return this.sessionsService.list();
    }

    @Get('list-running')
    listRunning() {
        return this.sessionsService.listRunning();
    }
}
