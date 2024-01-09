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


router.get('/manage', async (req, res) => {
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
    const userEmail = req.query.email;
    console.log(userEmail)
    if (!userEmail) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }else{
      res.json(user);
    }


  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/update', async (req, res) => {
  try {
    const userEmail = req.body.email;
    console.log(userEmail);
    if (!userEmail) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    const updatedUserData = req.body;
    const user = await User.findOneAndUpdate({ email: userEmail }, updatedUserData, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }else{
      res.status(200).json({message:"User Updated"});
    }
   
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log(userEmail);

    if (!userEmail) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    const user = await User.findOneAndDelete({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
