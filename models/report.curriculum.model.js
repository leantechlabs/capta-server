const mongoose = require("mongoose");

const curriculumSchema = new mongoose.Schema({
    name: String,
    format: String,
  });

 module.exports = mongoose.model('ReportCurriculum',curriculumSchema)

