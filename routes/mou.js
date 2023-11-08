const express = require('express');
const nanoid = require('nanoid');
const MOU = require('../models/mou.model');

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    let uniqueMOUID;
    let isUnique = false;

    while (!isUnique) {
      uniqueMOUID = nanoid(6);
      const existingMOU = await MOU.findOne({ MOUID: uniqueMOUID });
      if (!existingMOU) {
        isUnique = true;
      }
    }

    const newMOU = new MOU({
      MOUID: uniqueMOUID,
      // Other MOU fields here
    });

    newMOU.Confirmation.Cdate = null;
    newMOU.Confirmation.CStatus = null;
    newMOU.Confirmation.Comments = null;

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
