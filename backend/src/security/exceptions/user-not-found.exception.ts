import {HttpException, HttpStatus} from "@nestjs/common";

export class UserNotFoundException extends HttpException {
    constructor() {
        super("L'utilisateur n'existe pas.", HttpStatus.BAD_REQUEST);
    }
}