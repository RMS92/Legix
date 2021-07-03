import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {Role} from "../enums/role.enum";
import {ROLES_KEY} from "../decorators/roles.decorator";
import {UsersService} from "../../users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        // Find user in db
        const actualUser = await this.usersService.findOne(user._id)

        let isAuthorized = false;

        actualUser.roles.map((role) => {
            if (requiredRoles.includes(role)) {
                isAuthorized = true
            }
        })

        return isAuthorized;
    }
}
