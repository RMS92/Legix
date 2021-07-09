import {HttpException, HttpStatus} from "@nestjs/common";

export class UsernameAlreadyUsedException extends HttpException {
    constructor() {
        super("Le nom d'utilisateur est déjà utilisé.", HttpStatus.BAD_REQUEST);

    }
}