import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth2';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { createHash, verifyHash } from '../utils/hash';
import { createToken } from '../utils/token';
import UserDTO from '../dto/user';
import dao from '../data/index.factory.js';
import type { CustomError } from './errorHandler';
import { StatusCodes } from 'http-status-codes';
import env from '../utils/env';
import type { Request } from 'express';

const { GOOGLE_ID, GOOGLE_CLIENT, SECRET } = env;

passport.use(
  'register',
  new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
    try {
      let one = await dao.users.readByEmail({ email });
      if (!one) {
        let data = req.body;
        data.password = createHash(password);
        data = new UserDTO(data);
        const user = await dao.users.create(data);
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'User already exists',
          statusCode: StatusCodes.BAD_REQUEST,
        } as CustomError);
      }
    } catch (error) {
      return done(error);
    }
  })
);
passport.use(
  'login',
  new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
    try {
      const user = await dao.users.readByEmail({ email });
      if (user && verifyHash(password, user.password)) {
        const token = createToken({ email, role: user.role });
        req.token = token;
        return done(null, user);
      } else {
        return done(null, false, { message: 'Bad auth' });
      }
    } catch (error) {
      return done(error);
    }
  })
);
passport.use(
  'google',
  new GoogleStrategy(
    {
      passReqToCallback: true,
      clientID: GOOGLE_ID,
      clientSecret: GOOGLE_CLIENT,
      callbackURL: 'http://localhost:8080/api/sessions/google/callback',
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
      try {
        const one = await dao.users.readByEmail({ email: profile.id + '@gmail.com' });
        if (!one) {
          const data = {
            email: profile.id + '@gmail.com',
            name: profile.name.givenName,
            lastName: profile.name.familyName,
            photo: profile.coverPhoto,
            password: createHash(profile.id),
          };
          const user = await dao.users.create(data);
          return done(null, user);
        }
        return done(null, one);
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies['token']]),
      secretOrKey: SECRET,
    },
    async ({ email }, done) => {
      try {
        const user = await dao.users.readByEmail({ email });
        if (user) {
          user.password = '';
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
