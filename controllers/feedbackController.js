const Sequelize = require('sequelize');
const model = require('../models/index')
const sequelize = model.sequelize



class feedbackController {

  createFeeback = async(req,res)=>{
    try{
        console.log("FEEDBACK CONTROLLER HIT")
        let data = {
            ride_id: req.body.ride_id,
            comment:req.body.feedback,
            rating: req.body.rating 
          }

          const feedbackEntry = await sequelize.query(`INSERT INTO feedback (ride_id,comment,rating) VALUES(:ride_id,:comment,:rating)`,{
            type: Sequelize.QueryTypes.INSERT,
            replacements:data,
            raw:true
          })
      console.log("RESULT feedback",feedbackEntry)
      return res.json({
        outcome:'success',
        data:feedbackEntry
      });
    } catch (error) {
      console.log("Error in feedback", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  
}

module.exports = feedbackController