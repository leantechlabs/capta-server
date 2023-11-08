const express = require('express');
const Module = require('./models/module.model');

const router = express.Router();

router.post('/create', async (req, res) => {
  try{
    const {
      Curriculum,
      ModuleName,
      TotalHours,
      TotalDays,
      TotalBatches,
      StartDate,
      EndDate,
    } = req.body;

    //Basic Input Validation
    if (!Curriculum || !ModuleName || !TotalHours || !TotalDays || !TotalBatches || !StartDate || !EndDate) {
      return res.status(400).json({ message: 'All fields are required' });
    };
    

    const newModule = new Module({
      Curriculum,
      ModuleName,
      TotalHours,
      TotalDays,
      TotalBatches,
      StartDate,
      EndDate,
    });

    await newModule.save();
    res.status(201).json({message : 'Module created successfully'});
  } catch(error){
    console.error('Error creating module: ' , error)
    res.status(500).json({message : 'Internal server error'});
  }
});

router.post('/manage', async (req, res) => {
  try{
    const modules =  await Module.find({} , '_id ModuleName TotalHours TotalDays TotalBatches StartDate EndDate');

    res.json(modules);
  } catch(error){
    console.error('Error fetching module : ' , error);
    res.status(500).json({error : 'Internal server error'})
  }
});

module.exports = router;
