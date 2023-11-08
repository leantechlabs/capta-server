import express from 'express';
import passport from 'passport';

const loginrouter = express.Router();

loginrouter.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      console.log('Failure redirect');
      if (info && info.message === 'Incorrect username.') {
        return res.status(401).json({ message: 'Username not found' });
      }
      return res.status(401).json({ message: 'password is incorrect' });
    }

    console.log('Success redirect');
    return res.status(200).json({ message: 'Logged in' });
  })(req, res, next);
});

export default loginrouter;
