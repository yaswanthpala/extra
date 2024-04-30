const {Sequelize} = require('sequelize');

const dbName = 'transit_system';
const userName = 'root';
const password = 'root';

const sequelize = new Sequelize(dbName,userName,password,{
    host:'localhost',
    dialect:'mysql'
});


const UserModel = require('./user');
const user = UserModel(sequelize,Sequelize.DataTypes);

const PaymentModel = require('./payment');
const payment = PaymentModel(sequelize,Sequelize.DataTypes);

const FeedBackModel = require('./feedback');
const feedBack = FeedBackModel(sequelize,Sequelize.DataTypes);


const TranisitModel = require('./transit');
const transit = TranisitModel(sequelize,Sequelize.DataTypes);


sequelize.sync({ force:true})

module.exports ={sequelize,user,transit,payment,feedBack};