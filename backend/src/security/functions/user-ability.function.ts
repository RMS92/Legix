import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { User } from '../../users/schemas/user.schema';
import { Action } from '../enums/action.enum';
import { Role } from '../enums/role.enum';
import { Scan } from '../../scans/schemas/scan.schema';
import { Comment } from '../../comments/schemas/comment.schema';

type Subjects =
  | InferSubjects<typeof User | typeof Scan>
  | typeof Comment
  | 'all';

export type UserAbility = Ability<[Action, Subjects]>;

export function createAbilitiesForUser(
  type: string,
  authUser: User,
  id: string,
) {
  const { can, cannot, build } = new AbilityBuilder<
    Ability<[Action, Subjects]>
  >(Ability as AbilityClass<UserAbility>);

  if (authUser.roles.includes(Role.ROLE_SUPERADMIN)) {
    can(Action.Manage, 'all');
  } else if (authUser.roles.includes(Role.ROLE_ADMIN)) {
    can(Action.Read, 'all');
    can(Action.Create, 'all');
    can(Action.Update, 'all');
    cannot(Action.Delete, 'all');
  } else if (
    authUser.roles.includes(Role.ROLE_USER) &&
    String(authUser._id) === id
  ) {
    if (type === 'users') {
      can(Action.Read, User);
      can(Action.Update, User);
      can(Action.Delete, User);
    }

    if (type === 'scans') {
      can(Action.Update, Scan);
    }

    if (type === 'comments') {
      can(Action.Delete, Comment);
    }
  }

  return build({
    // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
    detectSubjectType: (item) =>
      item.constructor as ExtractSubjectType<Subjects>,
  });
}
