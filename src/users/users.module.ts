import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [UsersService, PrismaService],
    controllers: [UsersController]
})
export class UsersModule {}
