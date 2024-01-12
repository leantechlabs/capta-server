const express = require('express');
const Curriculum = require('../models/curriculum.model');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    console.log(req.body)
    const { CurriculumName, excelData } = req.body;
    const newCurriculum = new Curriculum({ CurriculumName });
    const savedTopics = [];

    for (const data of excelData) {
      savedTopics.push(data); 
    }

    newCurriculum.topics = savedTopics;

    await newCurriculum.save();

    res.status(201).json({ message: 'Data received and saved successfully' });
  } catch (error) {
    console.error('Error saving curriculum data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/manage', async (req, res) => {
  try {
    const curriculums = await Curriculum.find({}, '_id CurriculumName topics.Hours topics.Day');

    const curriculumsWithStats = curriculums.map((curriculum) => {
      let totalHours = 0;
      let totalDays = new Set(); //  Set to avoid duplicate days

      for (const topic of curriculum.topics) {
        totalHours += topic.Hours;
        totalDays.add(topic.Day); //  Set to collect unique days
      }

      // Create a new object with the desired properties
      return {
        _id: curriculum._id,
        CurriculumName: curriculum.CurriculumName,
        TotalHours: totalHours,
        TotalDays: totalDays.size, //  size of the Set to get the unique day count
      };
    });

    res.json(curriculumsWithStats);
  } catch (error) {
    console.error('Error fetching curriculums:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/names', async (req, res) => {
  try {
    const curriculumNames = await Curriculum.find({} , 'CurriculumName');
    res.status(200).json(curriculumNames);
  } catch (error) {
    console.error('error fetching curriculum name : ' , error);
    res.status(500).json({error : 'Internal server error'});
  }
});

module.exports = router;
