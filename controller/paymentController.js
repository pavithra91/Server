var db = require('../config');
const Payment = require('../models/payment')
const express = require('express');
const app = express();
app.use(express.json());

// Create Campaign
const donate = async (req, res, next) => {
    try {
      if (!req.body) {
        return res.status(400).json({
          status: 'error',
          msg: 'Body is Required',
        });
      }
      const data = req.body;
  
      var createdDate = new Date();
      console.log(createdDate.toISOString().slice(0, 10));  
  
      Payment.campaignId = req.body.campaignId;
      Payment.amount = req.body.amount;
      Payment.donorName = req.body.name;
      Payment.message = req.body.message;
      Payment.paymentStatus = "Paid";
      Payment.dateCreated = createdDate;
  
      console.log(Payment); 

        const snapshot = await db.collection('Donations').doc().set(Payment).then(() => {
            console.log("Donation Added Sucessfully");           
          });

    let oldraiedAmount = 0;
    let oldnoOfDonations = 0;


    const cityRef = db.collection('Campaign').doc(req.body.campaignId);
    const doc = await cityRef.get();

    oldraiedAmount = doc.data().raiedAmount;
    oldnoOfDonations = doc.data().noOfDonations;



        console.log(oldraiedAmount);


       const updateresponse = await cityRef.update({raiedAmount: Number(oldraiedAmount) + Number(req.body.amount), noOfDonations: Number(oldnoOfDonations) + 1});

  
        return res.status(200).json({
          status: 'Success',
          data: updateresponse,
          msg: 'Donation Added Sucessfully',
        });

    } catch (error) {
      res.status(500).send(error.message);
    }
  }


  module.exports = {
    donate
  }