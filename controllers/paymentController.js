const Sequelize = require('sequelize');
const model = require('../models/index')
const sequelize = model.sequelize



class PaymentController {

  createPaymentRecord = async(req,res)=>{
    try {

        const [fareDetails] =  await sequelize.query(`SELECT * from fare WHERE ride_id=:ride_id`,{
            type: Sequelize.QueryTypes.SELECT,
            replacements:{ride_id:req.body.ride_id},
            raw:true
          })

          if(!fareDetails.id){
            console.log("No  fare details Available")
            return
          }
          if(req.body.payment_mode == 'CARD'){
            const [rideDetails] =  await sequelize.query(`SELECT id,passenger_id from ride WHERE id=:ride_id`,{
                type: Sequelize.QueryTypes.SELECT,
                replacements:{ride_id:req.body.ride_id},
                raw:true
              })

              
            await sequelize.query(`INSERT INTO saved_card (passenger_id,card_no,expiry,transactions_count) VALUES(:passenger_id,:card_no,:expiry,:transactions_count)`,{
                type: Sequelize.QueryTypes.INSERT,
                replacements:{
                    passenger_id:rideDetails.passenger_id,
                    card_no : req.body.card_no || '',
                    expiry : req.body.expiry || '',
                    transactions_count: 1
                },
                raw:true
              }) 
          }
        let paymentBody = {
            ride_id: req.body.ride_id,
        fare_id:fareDetails.id,
        payment_mode: String(req.body.payment_mode), // replace with your value
        status: 'PAID', 
        total_amount: Number(Number(fareDetails.subtotal)+Number(fareDetails.service_charge)-Number(fareDetails.discount_amount)).toFixed(2), // replace with your value
        amount_paid: Number(Number(fareDetails.subtotal)+Number(fareDetails.service_charge)-Number(fareDetails.discount_amount)).toFixed(2), // replace with your value
          }

          const paymentEntry = await sequelize.query(`INSERT INTO payment (ride_id,fare_id,payment_mode,status,total_amount,amount_paid) VALUES(:ride_id,:fare_id,:payment_mode,:status,:total_amount,:amount_paid)`,{
            type: Sequelize.QueryTypes.INSERT,
            replacements:paymentBody,
            raw:true
          })
      
      console.log("RESULT createPaymentRecord",paymentEntry)
      return res.json({
        outcome:'success',
        data:paymentEntry
      });
    } catch (error) {
      console.log("Error in createPaymentRecord", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  
}

module.exports = PaymentController