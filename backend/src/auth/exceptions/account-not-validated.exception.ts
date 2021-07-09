import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountNotValidatedException extends HttpException {
  constructor() {
    super("Votre compte n'a pas encore été confirmé.", HttpStatus.BAD_REQUEST);
  }
}
