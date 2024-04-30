const Sequelize = require('sequelize');
const model = require('../models/index')
const sequelize = model.sequelize

class PassengerController {

  getPassengerDetailsByContactNo = async(req,res)=>{
    try {
      const result = await sequelize.query(`SELECT id,email,name,contact_no,address FROM passenger WHERE contact_no = :contact_no`, {
        type: Sequelize.QueryTypes.SELECT,
        replacements:{contact_no:req.params.contact_no},
        raw:true
      });
      console.log("RESULT getPassengerDetailsByContactNo",result)
      return res.json({
        outcome:'success',
        data:result
      });
    } catch (error) {
      console.log("Error in getPassengerDetailsByContactNo", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  createPassenger = async (req, res) => {
    console.log("CREATE Passenger HITT",req.body)
    try {
       const {name,email,address,contact_no,password} = req.body
      const [result] = await sequelize.query(`INSERT INTO passenger (name,email,address,contact_no,password) VALUES(:name,:email,:address,:contact_no,:password)`, {
        replacements:{name,email,address,contact_no,password},
        type: Sequelize.QueryTypes.INSERT,
        raw: true,
      });
      return res.json({
        outcome:'success',
        data:result
      })
    } catch (error) {
      console.log("Error in createPassenger", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getPassengerDetailsById = async(req,res) =>{
    try {
    
     const [result] = await sequelize.query(`SELECT * FROM passenger WHERE id=:id`, {
       replacements:{id:req.params.id},
       type: Sequelize.QueryTypes.SELECT,
       raw: true,
     });
     return res.json({
       outcome:'success',
       data:result
     })
   } catch (error) {
     console.log("Error in getPassengerDetailsById", error);
     return res.status(500).json({ error: "Internal Server Error" });
   }
  }
}

module.exports = PassengerController