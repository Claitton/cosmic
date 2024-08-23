import { Module } from '@nestjs/common';
import { OrganizationsModule } from './organizations/organizations.module';
import { SessionsModule } from './sessions/sessions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [SessionsModule, OrganizationsModule, UsersModule],
  providers: [],
})
export class AppModule {}
