const mongoose = require('mongoose');


const ModuleSchema = new mongoose.Schema({
  Curriculum : String,
  ModuleName : String,
  TotalHours : Number,
  TotalDays:Number,
  TotalBatches:Number,
  StartDate:Date,
  EndDate:Date,

});

const Module = mongoose.model('Module' , ModuleSchema);
