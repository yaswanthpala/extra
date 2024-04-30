const express = require('express');
const router = express.Router();


const PaymentController = require('../controllers/paymentController');
const passengerControllerObj = new PaymentController();


router.post('/createPaymentRecord',passengerControllerObj.createPaymentRecord);



module.exports = router;



 