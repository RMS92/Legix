import {Module} from '@nestjs/common';
import {MailService} from './mail.service';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {ConfigService} from "@nestjs/config";
const path = require("path")

@Module({
    imports: [
        MailerModule.forRootAsync({
            // imports: [ConfigModule], // import module if not enabled globally
            useFactory: async (config: ConfigService) => ({
                // transport: config.get("MAIL_TRANSPORT"),
                // or
                transport: {
                    host: config.get('MAIL_HOST'),
                    port: 1025,
                    ignoreTLS: true,
                    secure: false,
                    /* auth: {
                        user: config.get('MAIL_USER'),
                        pass: config.get('MAIL_PASSWORD'),
                    }, */
                },
                defaults: {
                    from: `"No Reply" <${config.get('MAIL_FROM')}>`,
                },
                template: {
                    dir: path.resolve(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
}
