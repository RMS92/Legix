import {HttpException, HttpStatus} from "@nestjs/common";

export class AccountNotFoundException extends HttpException {
    constructor() {
        super("Aucun compte ne correspond à cet email.", HttpStatus.BAD_REQUEST);
    }
}