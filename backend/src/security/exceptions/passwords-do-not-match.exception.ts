import {HttpException, HttpStatus} from "@nestjs/common";

export class PasswordsDoNotMatchException extends HttpException {
    constructor() {
        super("Les mots de passe ne correspondent pas.", HttpStatus.BAD_REQUEST);

    }
}