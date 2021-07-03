import {Role} from "../../security/enums/role.enum";
import {IsArray} from "class-validator";

export class UpdateRolesUserDto {

    @IsArray()
    roles?: Role[]
}
