const mongoose = require('mongoose');

const CurriculumSchema = new mongoose.Schema({
  
  CurriculumName: String,
  topics: [
    {
      Day: Number,
      Topic: String,
      'Sub Topic': String,
      'Practice Programs': String,
      Hours: Number,
    },
  ],
});

const Curriculum = mongoose.model('curriculums', CurriculumSchema);
module.exports = Curriculum;