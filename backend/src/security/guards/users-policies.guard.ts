import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PolicyHandler } from '../interfaces/users-policy.interface';
import { CHECK_USERS_POLICIES_KEY } from '../decorators/check-users-policies.decorator';
import { UsersService } from '../../users/users.service';
import {
  createAbilitiesForUser,
  UserAbility,
} from '../functions/user-ability.function';
import { ScansService } from '../../scans/scans.service';
import { CommentsService } from '../../comments/comments.service';

@Injectable()
export class UsersPoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ScansService))
    private readonly scansService: ScansService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_USERS_POLICIES_KEY,
        context.getHandler(),
      ) || [];
    let ability: UserAbility = null;
    const { user, params } = context.switchToHttp().getRequest();

    const authUser = await this.usersService.findOne(user._id);

    if (params.id !== undefined) {
      // Search for object type in url to get the item
      const type = context.switchToHttp().getRequest().url.split('/')[2];

      if (type === 'users') {
        const paramsUser = await this.usersService.findOne(params.id);
        ability = createAbilitiesForUser(
          type,
          authUser,
          String(paramsUser._id),
        );
      }

      if (type === 'scans') {
        const typeBy = context.switchToHttp().getRequest().url.split('/')[3];
        if (typeBy === 'users') {
          const paramsUser = await this.usersService.findOne(params.id);
          ability = createAbilitiesForUser(
            typeBy,
            authUser,
            String(paramsUser._id),
          );
        } else {
          const paramsScan = await this.scansService.findOne(params.id);
          ability = createAbilitiesForUser(
            type,
            authUser,
            String(paramsScan.user._id),
          );
        }
      }

      if (type === 'comments') {
        const paramsComment = await this.commentsService.findOne(params.id);
        ability = createAbilitiesForUser(
          type,
          authUser,
          String(paramsComment.author),
        );
      }
      // Find classic ability for user
    } else {
      ability = createAbilitiesForUser('default', authUser, params.id);
    }

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: UserAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
