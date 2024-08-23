import { Module } from '@nestjs/common';
import { OrganizationsModule } from './organizations/organizations.module';
import { SessionsModule } from './sessions/sessions.module';
import { UsersModule } from './users/users.module';
import { MembersModule } from './members/members.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SessionsModule, OrganizationsModule, UsersModule, MembersModule, AuthModule],
})
export class AppModule {}
