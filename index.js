const express = require('express');
const bodyParser= require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());

app.use(cors());






const payment = require('./routes/payment');
app.use('/payment',payment)



const feedBack = require('./routes/feedback');
app.use('/feedback',feedBack)


const tranist = require('./routes/tranisit');
app.use('/tranist',tranist)

app.listen(3009, () => {
    console.log('application started on 3009');
  })