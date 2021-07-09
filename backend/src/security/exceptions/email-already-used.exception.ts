import {HttpException, HttpStatus} from "@nestjs/common";

export class EmailAlreadyUsedException extends HttpException {
    constructor() {
        super("L'email est déjà utilisé.", HttpStatus.BAD_REQUEST);

    }
}