import { Module } from '@nestjs/common';
import { SessionsModule } from './sessions/sessions.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [SessionsModule, OrganizationsModule],
  providers: [],
})
export class AppModule {}
