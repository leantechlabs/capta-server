import express from require('express');

const {mouCreate}= require('.')

const router = express.Router();

router.post('/mou/create',mouCreate);
router.post('/mou/confirm', mouConf);
// app.use('/api/user', userRouter);
// app.use('/api/college', collegeRouter);
// app.use('/api/mou', mouRouter);
// // Add more routes...


module.exports = router;