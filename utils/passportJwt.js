import passportJwt from "passport-jwt";
import passport from "passport";
import { prisma } from "../lib/prisma.js";
import "dotenv/config.js";

const JwtStrategy = passportJwt.Strategy;

const ExtractJwt = passportJwt.ExtractJwt;

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = process.env.SECRET_KEY;
opts.algorithms = ["HS256"]

passport.use(
  new JwtStrategy(opts, async function (payload, done) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });
      if (!user) return done(null,false);
      done(null,user)
    } catch (err) {
      return done(err, false);
    }
  }),
);
