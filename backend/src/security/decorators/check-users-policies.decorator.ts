import { PolicyHandler } from '../interfaces/users-policy.interface';
import { SetMetadata } from '@nestjs/common';

export const CHECK_USERS_POLICIES_KEY = 'check_users_policy';
export const CheckUsersPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_USERS_POLICIES_KEY, handlers);
