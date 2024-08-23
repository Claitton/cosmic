import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService, PrismaService]
})
export class MembersModule {}
