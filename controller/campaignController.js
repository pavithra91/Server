var db = require('../config');
const Campaign = require('../models/campaign')
const express = require('express');
const app = express();
app.use(express.json());


// Create Campaign
const create = async (req, res, next) => {
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

    var id = db.collection('Campaign').doc().id;

    Campaign.campaignName = req.body.campaignName;
    Campaign.campaignStartDate = req.body.campaignStartDate;
    Campaign.campaignEndDate = req.body.campaignEndDate;
    Campaign.campaignDescription = req.body.campaignDescription;
    Campaign.goalAmount = req.body.goal;
    Campaign.raiedAmount = 0.0;
    Campaign.city = req.body.city;
    Campaign.province = req.body.province;
    Campaign.campaignStatus = "Request";
    Campaign.dateCreated = createdDate;
    Campaign.createdBy = req.body.createdBy;
    Campaign.id = id;

    console.log(Campaign);



    const snapshot = await db.collection('Campaign').doc(id).set(Campaign).then(() => {
      console.log("Campaign Created Sucessfully");

      return res.status(200).json({
        status: 'Success',
        data: "Campaign",
        msg: 'Campaign Created Sucessfully',
      });
    });
    // if (snapshot.empty) {
    //   console.log('No matching documents.');
    //   return res.status(400).json({
    //     status: 'error',
    //     msg: 'User Authenticated Failed',
    //   });
    // }else
    // {
    //   return res.status(200).json({
    //       status: 'Success',
    //       data : "Campaign",
    //       msg: 'Campaign Created Sucessfully',
    //     });
    // }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Get All Campaigns of Specific User
const getCampaigns = async (req, res, next) => {
  try {
    const id = "APNZn4jjhEvTLE9CQW8Z";//req.body.id;

    const citiesRef = db.collection('Campaign');
    const snapshot = await citiesRef.where('createdBy', '==', 'lqblyRwIeylJjL6V8Chj').get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

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



  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Get Campaign
const getCampaign = async (req, res, next) => {
  try {
    let id = req.query.id;

    console.log("Request Received");

    const cityRef = db.collection('Campaign').doc(id);
    const doc = await cityRef.get();

    console.log(doc.data());

    if (!doc.exists) {
      console.log('No such document!');
      return res.status(400).json({
        status: 'error',
        msg: 'No such document!',
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: doc.data(),
        msg: 'Document Found',
      });
    }

  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

module.exports = {
  create,
  getCampaign,
  getCampaigns
}

