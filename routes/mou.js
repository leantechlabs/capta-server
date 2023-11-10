// routes/mou.routes.js
const express = require('express');
const nanoid = require('nanoid');
const Mou = require('../models/mou.model');

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const uniqueMOUID = nanoid(6);

    const newMOUData = {
      MOUID: uniqueMOUID,
      Date: req.body.Date,
      Location: req.body.Location,
      FirstParty: req.body.FirstParty,
      SecondParty: req.body.SecondParty,
      TermsConditions: req.body.TermsConditions,
      General: req.body.General,
      PurposeScope: req.body.PurposeScope,
      PaymentTerms: req.body.PaymentTerms,
      Termination: req.body.Termination,
    };

    const newMOU = new Mou(newMOUData);

    await newMOU.save();

    res.status(200).json({
      message: 'MOU Created Successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `MOU Creation Error ${error.message}`,
    });
  }
});

module.exports = router;
