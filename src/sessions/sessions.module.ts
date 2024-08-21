import { Module } from '@nestjs/common';
import { SessionsGateway } from './sessions.gateway';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
    providers: [SessionsGateway, SessionsService],
    controllers: [SessionsController]
})
export class SessionsModule {}
