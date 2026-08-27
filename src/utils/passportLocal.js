import passport from "passport";
import { prisma } from "../lib/prisma.js";
import  LocalStrategy  from "passport-local";
import { verifyPassword } from "./password.js";

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },async function (username, password, done) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: username.toLowerCase() },
      });
      if (!user) return done(null, false);
      const verifiedPassword = await verifyPassword(password, user.pwd);
      if (!verifiedPassword) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);
