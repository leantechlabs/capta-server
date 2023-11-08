const mouCreate = require('../models/user.model')


const mouCreater = async (req,res)=>{
    try {
        const newMou = new mouCreate(req.body);
        await newMou.save()
        res.status(200).send({
            message: "MOU Created Sucessfully",
            success:false,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:`MOU Creates Error ${error.message}`
        })
    }
}


const mouConfirmation =async(req,res)=>{
    try {
        const newMouConf = new mouConf(req.body);
        await newMouConf.save()
        res.status(200).send({
            message: "MOU Confirmation Sucessfully",
            success:false,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:`MOU Confirmation Error ${error.message}`
        });
    }
}

module.exports = {mouCreater,mouConfirmation};