const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    userId: String,
    phoneNumber: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
    resume: String,
    adhar: String,
    pan: String,
    password: String,
    photo: String,
    role: String,
    trainerType: String,
    skills: String,
    salary: String,
    bankAccounts: [
      {
        bankName: String,
        branchCode: String,
        accountNumber: String,
        ifscNumber: String,
      },
    ],
  });

const User = mongoose.model('user', UserSchema);

module.exports = User;
