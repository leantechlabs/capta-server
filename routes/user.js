const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Institution = require('../models/college.model');
const router = express.Router();
router.post('/register', async (req, res) => {

});
router.post('/add', async (req, res) => {
  try {
    const userData = req.body;
    const email = userData.email;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    if (!userData.trainerType) {
      userData.role = '1';
    } else {
      userData.role = '2';
    }
    if (!userData.password) {
      userData.password = 'Capta@123';
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData.password = hashedPassword;
    const newUser = new User(userData);
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/manage', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }, { password: 0 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/edit', async (req, res) => {
  try {
    const useremail = req.body.email;
    const users = await User.find({ email:useremail});
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
