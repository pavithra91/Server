var db = require('../config');
const Payment = require('../models/payment')
const express = require('express');
const app = express();
app.use(express.json());
require("dotenv").config();

const logger = require('../controller/logger')

// Create Campaign
const donate = async (req, res, next) => {
  // try {
  if (!req.body) {
    return res.status(400).json({
      status: 'error',
      msg: 'Body is Required',
    });
  }
  const usrId = req.body.userId;
  const amount = req.body.amount;

  var createdDate = new Date();
  console.log(createdDate.toISOString().slice(0, 10));

  Payment.campaignId = req.body.campaignId;
  Payment.amount = amount;
  Payment.donorName = req.body.name;
  Payment.message = req.body.message;
  Payment.paymentStatus = "Paid";
  Payment.dateCreated = createdDate;
  Payment.donationStatus = req.body.donationMode;
  Payment.trxref = req.body.trxref;

  console.log(Payment);

  const snapshot = await db.collection('Donations').doc().set(Payment).then(() => {
    console.log("Donation Added Sucessfully");
  });

  // Update Dashboard values
  const dashboardRef = db.collection('Admin-Dashboard').doc(process.env.DASHBOARD_DOC_ID);
  const dashboardSnapshot = await dashboardRef.update({
    noOfTransactions: fieldValue.increment(1), amounRaised: fieldValue.increment(amount)
  });

  let oldraiedAmount = 0;
  let oldnoOfDonations = 0;

  const cityRef = db.collection('Campaign').doc(req.body.campaignId);
  const doc = await cityRef.get();

  oldraiedAmount = doc.data().raiedAmount;
  oldnoOfDonations = doc.data().noOfDonations;

  // Update campaign goal/raised amounts
  const updateresponse = await cityRef.update({ raiedAmount: Number(oldraiedAmount) + Number(amount), noOfDonations: Number(oldnoOfDonations) + 1 });

  if (!req.body.donationMode) {

    const userRef = db.collection('User').doc(usrId);
    var badgeUpdteResponse = await CalculatePoints(userRef, usrId, amount);

    return res.status(200).json({
      status: 'success',
      data: badgeUpdteResponse,
      msg: 'Donation Complete',
    });
  }

  //// } catch (error) {
  //   return res.status(500).send(error.message);
  // }
}

async function CalculatePoints(userRef, usrId, amount) {
  const donationPointsRef = db.collection('Donation-Points');
  const donationPointSnapshot = await donationPointsRef.get();

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  console.log(firstDay);
  console.log(lastDay);

  const previousRef = db.collection('Donations');
  const previousSnapshot = await previousRef.where('userId', '==', usrId).where('dateCreated', '>=', firstDay).get();

  let donationPoints = 0;

  previousSnapshot.forEach(doc => {
    //  console.log(doc.data());
    donationPointSnapshot.forEach(element => {
      donationPoints = Number(element.data().first_month)
      console.log("first Month points " + donationPoints);
    })
  });

  const donationRef = db.collection('DonationPointRules');
  const donationsnapshot = await donationRef.get();
  donationsnapshot.forEach(doc => {
    if (Number(amount) > Number(doc.data().min) && Number(amount) <= Number(doc.data().max)) {
      console.log("Already available points " + Number(doc.data().points));
      donationPoints = donationPoints + Number(doc.data().points);
      console.log("Donation Points " + donationPoints);
    }
  });

  const usersnapshot = await userRef.get();
  donationPoints = donationPoints + usersnapshot.data().donationPoints;

  const badgesRef = db.collection('Badges');
  const badgessnapshot = await badgesRef.get();
  var newBadgeID = "";


  badgessnapshot.forEach(doc => {
    if (Number(donationPoints) >= Number(doc.data().minPoints) && Number(donationPoints) <= Number(doc.data().maxPoints)) {
      console.log(doc.data().badgeName);
      newBadgeID = doc.data().id
      console.log("New Badge ID " + newBadgeID);
    }
  });

  const userBadgesRef = db.collection('Donation-Badges').doc(usrId);
  const UserBadgessnapshot = await userBadgesRef.get();
  var isUpdate = true;

  var badgeList = [];

  UserBadgessnapshot.data().badge.forEach(item => {
    if (newBadgeID == item) {
      console.log(item);
      isUpdate = false;
      badgeList.push(item);
    }
    else {
      badgeList.push(item);
    }
  });

  if (isUpdate) {
    if (newBadgeID != "") {
      badgeList.push(newBadgeID);
    }
  }

  console.log(badgeList);
  if (isUpdate == true) {
    const response = await userBadgesRef.update({ badge: badgeList });
  }

  const response = await userRef.update({ donationPoints: donationPoints });

  return response;
}

// Get All Payment Details
const getAllPaymentDetails = async (req, res, next) => {
  try {
    let fromDate = new Date(req.body.fromDate);
    let toDate = new Date(req.body.toDate);

    console.log(req.body.fromDate);
    console.log(fromDate);

    const paymentRef = db.collection('Donations');
    const PaymentResponse = await paymentRef.where('dateCreated', '>=', fromDate).where('dateCreated', '<=', toDate).get();

    var Paymentlist = [];
    PaymentResponse.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      Paymentlist.push(doc.data())
    });

    return res.status(200).json({
      status: 'success',
      data: Paymentlist,
      msg: 'Payment List Found',
    });
  }
  catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  donate,
  getAllPaymentDetails
}