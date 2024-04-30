const express = require('express');
const router = express.Router();


const FeedbackController = require('../controllers/feedbackController');
const feedbackControllerObj = new FeedbackController();


router.post('/create',feedbackControllerObj.createFeeback);



module.exports = router;



 