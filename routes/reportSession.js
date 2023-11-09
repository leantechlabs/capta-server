const express = require('express');
const router = express.Router();
const Curriculum = require('../models/report.curriculum.model')
const Institution = require('../models/college.model')
const Module = require('../models/module.model')
router.post('/curriculum',async (req,res) => {
    try {
        const { selectedCurriculum, selectedFormat } = req.body;
    
        // Create a new curriculum report
        const newCurriculum = new Curriculum({
          name: selectedCurriculum,
          format: selectedFormat,
        });
    
        // Save the curriculum report to the database
        await newCurriculum.save();
    
        res.json({ message: 'Curriculum report saved successfully' });
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
      }

})

router.post('/colleges',async (req,res)=>{
  
  try {
     const {college} = req.body;
     const colleges = await Institution.find({collegeName:college})
  
    res.json({ message: 'College report generated successfully',data:colleges});
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
  
})

router.post('/modules', async (req, res) => {
  try {

    const { module } = req.body
    const modules = await Module.find({ModuleName:module})

    res.json({ message: 'Module report generated successfully',data:modules });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/trainers', async (req, res) => {
  try {
    //  logic for generating trainer reports goes here
    res.json({ message: 'Trainer report generated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});






module.exports = router