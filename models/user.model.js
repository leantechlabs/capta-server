import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('user', userSchema);

module.exports = User;

 
///MOU create Schema

const mouSchema = new mongoose.Schema({
    MOUID: {
        type: Number,
        required: [true, "MOUID is require"],
        unique: true, 
        autoIncrement: true, 
      },
    Date:{
        type: Date,
        required:[true, "Date is require"],
        default: Date.now
    },
    Location:{
        type: String,
        required:[true, "Location is require"],
    },
    firstParty: {
        name: {
            type: String,
            required:[true, "name is require"],
        },
        address: {
            type: String,
            required:[true, "address is require"],
        },
        representative: {
            type: String,
            required:[true, "representative is require"],
        },
        contact: {
            type: String,
            required:[true, "contact is require"],
        },
      },
      secondParty: {
        name: {
            type: String,
            required:[true, "name is require"],
        },
        location: {
            type: String,
            required:[true, "Location is require"],
        },
        representative: {
            type: String,
            required:[true, "Representative is require"],
        },
      },
      termsConditions: {
        natureOfRelationship: {
            type: String,
            required:[true, "natureOfRelationship is require"],
        },
        mutualObligation: {
            type: String,
            required:[true, "mutualObligation is require"],
        },
        limitationsAndWarranties: {
            type: String,
            required:[true, "limitationsAndWarranties is require"],
        },
      },
      purposeScope: {
        details: {
            type: String,
            required:[true, "details is require"],
        },
        collaborationPeriod: {
            type: String,
            required:[true, "collaborationPeriod is require"],
        },
        otherDetails: {
            type: String,
            required:[true, "otherDetails is require"],
        },
      },
      paymentTerms: {
        amountPerStudent: {
            type: Number,
            required:[true, "amountPerStudent is require"],
        },
        firstInstallment: {
            type: Number,
            required:[true, "firstInstallment is require"],
        },
        secondInstallment: {
            type: Number,
            required:[true, "secondInstallment is require"],
        },
        thirdInstallment: {
            type: Number,
            required:[true, "thirdInstallment is require"],
        },
        finalInstallment: {
            type: String,
            required:[true, "finalInstallment is require"],
        },
        paymentMethod: {
            type: String,
            required:[true, "paymentMethod is require"],
        },
      },
      termination: {
        terminationConditions: {
            type: String,
            required:[true, "terminationConditions is require"],
        },
        paymentDue: {
            type: String,
            required:[true, "paymentDue is require"],
        },
      },

});

 


const mouCreate = mongoose.model('MouCreate', mouSchema);

module.exports = mouCreate;

/// MOU CONFIRMATION Schema

const mouConfSchema = new mongoose.Schema({

    MOUID: {
        type: Number,
        required: [true, "MOUID is require"],
        unique: true, 
        autoIncrement: true, 
      },
    Date:{
        type: Date,
        required:[true, "Date is require"],
        default: Date.now
    },
    ConfirmationStatus:{
        type:String,
        required:[true, "ConfirmationStatus is require"],
    },
    Comments:{
        type:String,
        require:[true, "Comments is require"],
    },
});

const mouConf = mongoose.model('MouCreate', mouConfSchema);

module.exports = mouConf;