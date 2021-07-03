import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {ConfigService} from "@nestjs/config";
import {LocalStrategy} from "./strategies/local.strategy";
import {SessionSerializer} from "./utils/serializer.utill";

@Module({
    imports: [UsersModule,

        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {expiresIn: '3600s'},
            })
        }),
    ],

    providers: [AuthService, JwtStrategy, JwtAuthGuard, LocalStrategy, SessionSerializer],
    exports: [AuthService]
})
export class AuthModule {
}
