import { Module } from '@nestjs/common';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  providers: [],
})
export class AppModule {}
