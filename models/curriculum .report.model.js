const mongoose = require("mongoose");


const curriculumSchema = new mongoose.Schema({
    name: String,
    format: String,
  });
  

const ReportCurriculum = mongoose.model('ReportCurriculum', curriculumSchema);

module.exports = ReportCurriculum
  