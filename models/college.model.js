const mongoose = require('mongoose');
const institutionSchema = new mongoose.Schema({
    collegeName: String,
    eamcetCode: String,
    gstNumber: String,
    panNumber: String,
    email: String,
    phoneNumber: Number,
    address: String,
    city: String,
    country: String,
    postalCode: String,
    chairmanName: String,
    chairmanEmail: String,
    chairmanPhoneNumber: Number,
  },
  { timestamps: true }
);

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;
