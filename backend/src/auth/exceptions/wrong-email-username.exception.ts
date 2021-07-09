import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongEmailUsernameException extends HttpException {
  constructor() {
    super('Adresse email ou mot de passe incorrect', HttpStatus.BAD_REQUEST);
  }
}
