import {HttpException, HttpStatus} from "@nestjs/common";

export class TokenExpiredException extends HttpException {
    constructor() {
        super('Le token a expiré.', HttpStatus.BAD_REQUEST);

    }
}