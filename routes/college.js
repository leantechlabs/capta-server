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



module.exports = router;
