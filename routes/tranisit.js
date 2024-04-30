const express = require('express');
const router = express.Router();



const TransitController = require('../controllers/transitController');
const transitControllerObj = new TransitController();




router.post('/create',transitControllerObj.createTransit);
router.get('/getTransit',transitControllerObj.getTransit);


// router.put('/updateDriverByAdmin',adminControllerObj.updateDriverByAdmin);

// router.put('/upatePassengerByAdmin',transitControllerObj.upatePassengerByAdmin);

// router.post('/',driverControllerObj.createDriver);


module.exports = router;