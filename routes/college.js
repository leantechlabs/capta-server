const express = require('express');
const Institution = require('../models/college.model');

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const institutionData = req.body;
    const newInstitution = new Institution(institutionData);
    await newInstitution.save();
    res.status(200).json({ message: "Institution added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/manage', async (req, res) => {
  try {
    const colleges = await Institution.find({}, 'collegeName eamcetCode email phoneNumber');
    res.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/edit', async (req, res) => {
  try {
    const collegesEmail = req.query.email;
    console.log(collegesEmail)
    if (!collegesEmail) {
      return res.status(400).json({ error: 'parameter is required' });
    }
    const college = await Institution.findOne({ email: collegesEmail });
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }else{
      res.json(college);
    }

  } catch (error) {
    console.error('Error fetching College:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update', async (req, res) => {
  try {
    const CollegeEmail = req.body.email;
    console.log(CollegeEmail);
    if (!CollegeEmail) {
      return res.status(400).json({ error: 'parameter is required' });
    }
    const updatedUserData = req.body;
    const College = await Institution.findOneAndUpdate({ email: CollegeEmail }, updatedUserData, { new: true });

    if (!College) {
      return res.status(404).json({ error: 'User not found' });
    }else{
      res.status(200).json({message:"Updated"});
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
