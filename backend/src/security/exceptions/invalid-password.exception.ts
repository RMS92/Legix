import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends HttpException {
  constructor() {
    super('Mot de passe invalide.', HttpStatus.BAD_REQUEST);
  }
}
