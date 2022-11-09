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

    const updateresponse = await cityRef.update({ raiedAmount: Number(oldraiedAmount) + Number(req.body.amount), noOfDonations: Number(oldnoOfDonations) + 1 });

    if (req.body.userId != null) {
      var donationPoints = 0

      const donationRef = db.collection('DonationPointRules');
      const donationsnapshot = await donationRef.get();
      donationsnapshot.forEach(doc => {

        if (Number(req.body.amount) > Number(doc.data().min) && Number(req.body.amount) <= Number(doc.data().max)) {
          donationPoints = Number(doc.data().points);
          console.log("Donation Points " + donationPoints);
        }
      });

      var userdonationPoints = 0;

      const userRef = db.collection('User').doc("lqblyRwIeylJjL6V8Chj");
      const usersnapshot = await userRef.get();

      if (usersnapshot.empty) {
        console.log("empty");
      }

      const badgesRef = db.collection('Badges');
      const badgessnapshot = await badgesRef.get();
      var newBadge = "";

      userdonationPoints = usersnapshot.data().donationPoints + donationPoints;

      badgessnapshot.forEach(doc => {

        if (userdonationPoints > Number(doc.data().minPoints) && userdonationPoints <= Number(doc.data().maxPoints)) {
          console.log(doc.data().badgeName);
          newBadge = doc.data().id
        }
      });

      const userBadgesRef = db.collection('Donation-Badges').doc("lqblyRwIeylJjL6V8Chj");
      const UserBadgessnapshot = await userBadgesRef.get();
      var updateneeded = true;

      var badgeList = [];

      UserBadgessnapshot.data().badge.forEach(item => {
        if (newBadge == item) {
          console.log(item);
          updateneeded = false;
          badgeList.push(item);
        }
        else {
          badgeList.push(item);
        }
      });

      if (updateneeded) {
        badgeList.push(newBadge);
      }

      console.log(badgeList);
      if (updateneeded == true) {
        const response = await userBadgesRef.update({ badge: badgeList });
        console.log(response)
      }

    }
    else {
      console.log("else");
    }

    return res.status(200).json({
      status: 'Success',
       data: updateresponse,
      msg: 'Donation Added Sucessfully',
    });

  } catch (error) {
  }
}

// Get All Payment Details
const getAllPaymentDetails = async (req, res, next) => {
  // try {
     let date = req.query.status;
 

    const paymentRef = db.collection('Donation');
    paymentRef.where('dateCreated', '==', 'CO').where('dateCreated', '==', 'Denver'); 
    const commentResponse = await commentRef.where('campaignId', '==', id).get();

     var campaignlist = [];
     snapshot.forEach(doc => {
       console.log(doc.id, '=>', doc.data());
       campaignlist.push(doc.data())
     });
 
     return res.status(200).json({
       status: 'success',
       data: campaignlist,
       msg: 'Campaign List Found',
     });
}

module.exports = {
  donate,
  getAllPaymentDetails
}