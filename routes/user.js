const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const router = express.Router();

router.post('/register', async (req, res) => {
  // User registration logic here
  // ...
});

router.post('/add', async (req, res) => {
  const userData = req.body;
  const email= req.body.email;
  const existingUser = await User.findOne({ email: email });
  try {
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
        }

    if (!userData.trainerType){
      userData.role="1"
    }else{
      userData.role="2"
    }
    if (!userData.password) {
      userData.password = 'Capta@123';
    }
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/manage', async (req, res) => {
  try {
    // Exclude users with the role "admin"
    const users = await User.find({ role: { $ne: 'admin' } }, { password: 0 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
