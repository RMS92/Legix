import {UserAbility} from "../functions/user-ability.function";

interface UserPolicyHandler {
    handle(ability: UserAbility): boolean;
}

type PolicyHandlerCallback = (ability: UserAbility) => boolean;

export type PolicyHandler = UserPolicyHandler | PolicyHandlerCallback;
