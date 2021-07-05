import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from './guards/roles.guard';
import { UsersPoliciesGuard } from './guards/users-policies.guard';
import { ScansModule } from '../scans/scans.module';
import { MailModule } from '../mail/mail.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [UsersModule, ScansModule, AuthModule, MailModule, CommentsModule],
  providers: [SecurityService, RolesGuard, UsersPoliciesGuard],
  controllers: [SecurityController],
  exports: [SecurityService],
})
export class SecurityModule {}
