import passport from 'passport';
import passportJwt from 'passport-jwt';
import User from '../models/userSchema.js';

passport.use(
    new passportJwt.Strategy({
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    },
    async (jwt_payload, done) => {
        try {
            let user = await User.findOne({_id: jwt_payload.id});
            if (user) {
                user.password = null;
                return done(null, user);
            } else {
                return done(null, false); 
            }
        } catch (error) {
            console.log(error);
            return done(error, false);
        }
    })
);

export default passport;