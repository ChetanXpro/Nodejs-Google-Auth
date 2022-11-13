import { Strategy as GoggleStrategy } from "passport-google-oauth20";

import passport from "passport";
import { User } from "../models/user.js";
const connectPassport = () => {
  passport.use(
    new GoggleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        const user = await User.findOne({
          goggleId: profile.id,
        });

        if (user) {
          return done(null, user);
        }

        const newUser = await User.create({
          name: profile.displayName,
          goggleId: profile.id,
          photo: profile.photos[0].value,
        });

        return done(null, newUser);
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
export default connectPassport;
