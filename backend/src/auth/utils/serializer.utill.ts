import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: Function): any {
    done(null, user._id);
  }

  async deserializeUser(id: string, done: Function): Promise<any> {
    const userToDeserialize = await this.usersService.findOne(id);
    const userInfo = {
      _id: userToDeserialize._id,
      email: userToDeserialize.email,
      username: userToDeserialize.username,
      full_name: userToDeserialize.full_name,
      roles: userToDeserialize.roles,
      avatarFile: userToDeserialize.avatarFile,
      created_at: userToDeserialize.created_at,
    };
    done(null, userInfo);
  }
}
