const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();


passport.use(new LocalStrategy({
  usernameField: 'email', 
  passwordField: 'password' 
},
  async (email, password, done) => {
    try {
      console.log(email,password);
      const user = await User.findOne({ email });
      console.log(user );

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

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error',err });
    }

    if (!user) {
      console.log(info);

      if (info && info.message === 'Incorrect username.') {
        return res.status(401).json({ message: 'Username not found' });
      }
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    let userRole =user.role ;
    console.log(userRole);
    if (userRole === '1') {
      userRole = 'moderator';
      console.log("esrfduserRole");

    } else if (userRole === '2') {
      userRole = 'trainer';
      console.log("userRole");

    }
    console.log(userRole);

    req.session.userId = user.id;
    req.session.userRole = user.role;

    console.log(req.session);
    const payload = { userId: user.id, role: userRole };
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status(200).json({ token, message: 'Logged in' });
  })(req, res, next);
});


router.get('/logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'strict' });
console.log(req.session);
  req.session.destroy(err => {
    if (err) {
      return res.send('Error occurred during logout');
    }
    res.redirect('/');
    console.log(req.session);

  });
});

router.post('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
