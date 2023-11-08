// auth.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.model'; 

passport.use(new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password' 
  },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
  
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (!passwordMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export default passport;
