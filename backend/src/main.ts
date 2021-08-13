import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

const MongoStore = require('connect-mongodb-session')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };

  const PORT = process.env.PORT || 3333;

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      },
      store: new MongoStore({
        uri: process.env.DATABASE_URL,
        collection: 'sessions',
      }),
    }),
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Set security-related HTTP headers

  // Cross-origin resource sharing
  app.enableCors(corsOptions);

  // Protection again cross-site request forgery

  await app.listen(PORT);
}

bootstrap();
