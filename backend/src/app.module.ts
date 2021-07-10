import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityModule } from './security/security.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ScansModule } from './scans/scans.module';
import { FilesModule } from './files/files.module';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from './mail/mail.module';
import { PasswordModule } from './password/password.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    SecurityModule,
    ScansModule,

    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    PassportModule.register({ session: true }),

    MongooseModule.forRoot(process.env.DATABASE_URL),

    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: true,
      removeListener: true,
      ignoreErrors: false,
    }),

    FilesModule,

    CommentsModule,

    MailModule,

    PasswordModule,

    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
