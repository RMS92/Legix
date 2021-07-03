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

@Injectable()
export class UsersPoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ScansService))
    private readonly scansService: ScansService,
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
      const paramsUser = await this.usersService.findOne(params.id);
      if (!paramsUser) {
        const paramScan = await this.scansService.findOne(params.id);
        ability = createAbilitiesForUser(
          'scan',
          authUser,
          String(paramScan.user._id),
        );
      } else {
        ability = createAbilitiesForUser(
          'user',
          authUser,
          String(paramsUser._id),
        );
      }

      // Find ability for user
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
