const mongoose = require('mongoose');

const mouSchema = new mongoose.Schema({
  MOUID: String,
  Date: {
    type: String,
    default: Date.now
  },
  Location: {
    type: String,
  },
  FirstParty: {
    Name: String,
    Address: String,
    Representative: String,
    Contact: String,
  },
  SecondParty: {
    Name: String,
    Location: String,
    Representative: String,
  },
  TermsConditions: {
    NatureOfRelationship: String,
    MutualObligation: String,
    LimitationsAndWarranties: String,
  },
  General:{type:String},
  PurposeScope: {
    Details: String,
    CollaborationPeriod: String,
    OtherDetails: String,
  },
  PaymentTerms: {
    AmountPerStudent: Number,
    FirstInstallment: Number,
    SecondInstallment: Number,
    ThirdInstallment: Number,
    FinalInstallment: Number,
    PaymentMethod: String,
  },
  Termination: {
    TerminationConditions: String,
    PaymentDue: String,
  },
  Confirmation: {
    Cdate: String,
    CStatus: String,
    Comments:String,
  },
});

const Mou = mongoose.model('MOU', mouSchema);
