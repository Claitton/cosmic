import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [OrganizationsService, PrismaService],
  controllers: [OrganizationsController]
})
export class OrganizationsModule {}
