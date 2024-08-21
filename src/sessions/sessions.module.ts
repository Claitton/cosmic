import { Module } from '@nestjs/common';
import { SessionsGateway } from './sessions.gateway';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    providers: [SessionsGateway, SessionsService, PrismaService],
    controllers: [SessionsController]
})
export class SessionsModule {}
