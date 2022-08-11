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
    Campaign.headerImg = "";
    Campaign.mainImg = "";
    Campaign.noOfDonations = 0;
    Campaign.shortDescription = req.body.shortDescription;

    console.log(Campaign);



    const snapshot = await db.collection('Campaign').doc(id).set(Campaign).then(() => {
      console.log("Campaign Created Sucessfully");

      return res.status(200).json({
        status: 'Success',
        data: id,
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
    const id = req.body.id;

    const citiesRef = db.collection('Campaign');
    const snapshot = await citiesRef.where('createdBy', '==', id).get();
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


// Get Watchlist of Specific User
const getWatchlist = async (req, res, next) => {
  try {
    const id = "zqMs0nNbj9bv7hu51eFd";//req.body.id;

    const cityRef = db.collection('Watchlist').doc(id);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
      return res.status(400).json({
        status: 'error',
        msg: 'User Authenticated Failed',
      });
    } else {
      console.log('Document data:', doc.data());

      campiagnList = doc.data().campaignId;
      console.log(campiagnList);

      const citiesRef = db.collection('Campaign');
    const snapshot = await citiesRef.where('id', 'in', campiagnList).get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    var campaignlist = [];
    snapshot.forEach(doc => {
      campaignlist.push(doc.data())
    });


    res.status(200).json({
      status: 'success',
      data: campaignlist,
      msg: 'Watchlist Data Found',
    });

      
    }

  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Update Campaign images
const updateCampaignImage = async (req, res, next) => {
  try {
    const id = req.body.id;
    const imgPath = req.body.imgPath;
    const mainImgSrc = req.body.mainImgSrc;

    console.log(id);
    console.log(imgPath);
    console.log(mainImgSrc);

    const userRef = db.collection('Campaign').doc(id);
    const response = await userRef.update({headerImg: imgPath, mainImg: mainImgSrc});

    console.log(response);

    return res.status(200).json({
      status: 'success',
      msg: 'Update Sucessfully',
    });
  
  } catch (er) {
    console.log(er);
  //   res.status(500).json({
  //     status: 'error',
  //     error: er,
  //   });
  }
}

const getCampaignDetails = async (req, res, next) => {
  try {
    let id = req.query.id;

    var _commentlist = [];
    var _faqlist = [];
    var _updateslist = [];
    var _response = [];

    const commentRef = db.collection('Comments');
    const commentResponse = await commentRef.where('campaignId', '==', id).get();

    if (commentResponse.empty) {
      console.log('No matching documents for comments.');
    }
    else{
      commentResponse.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        _commentlist.push(doc.data())
      });

      _response.push(_commentlist);
    }   

    const faqRef = db.collection('FAQ');
    const faqResponse = await faqRef.where('campaignId', '==', id).get();

    if (faqResponse.empty) {
      console.log('No matching documents for FAQs.');
    }
    else{      
      faqResponse.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        _faqlist.push(doc.data())
      });
      _response.push(_faqlist);
    }

    const updatesRef = db.collection('Campaign-Updates');
    const updatesResponse = await updatesRef.where('campaignId', '==', id).get();

    if (updatesResponse.empty) {
      console.log('No matching documents for recent updates.');
    }
    else{
      faqResponse.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        _updateslist.push(doc.data());
      });
      _response.push(_updateslist);
    }  

    return res.status(200).json({
      status: 'success',
      data: _response,
      msg: 'No error ouccred',
    });
  
  } catch (er) {
    console.log(er);
  //   res.status(500).json({
  //     status: 'error',
  //     error: er,
  //   });
  }
}

const getTopFundRaisers = async (req, res, next) => {
  try {
    const campaignRef = db.collection('Top-Fundraiser-Campaigns');
    const snapshot = await campaignRef.get();
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
      msg: 'No error ouccred',
    });
  
  } catch (er) {
    console.log(er);
  //   res.status(500).json({
  //     status: 'error',
  //     error: er,
  //   });
  }
}

// Get All Campaigns Requests
const getCampaignRequests = async (req, res, next) => {
  try {

    const citiesRef = db.collection('Campaign');
    const snapshot = await citiesRef.where('campaignStatus', 'in', ['Request', 'Under Review']).get();
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

// Update Campaign images
const UpdateCampaignStatus = async (req, res, next) => {
  try {
    const id = req.body.id;
    const reqStatus = req.body.reqStatus;

    const userRef = db.collection('Campaign').doc(id);
    const response = await userRef.update({campaignStatus: reqStatus});

    console.log(response);

    return res.status(200).json({
      status: 'success',
      msg: 'Update Sucessfully',
    });
  
  } catch (er) {
    console.log(er);
  //   res.status(500).json({
  //     status: 'error',
  //     error: er,
  //   });
  }
}


module.exports = {
  create,
  getCampaign,
  getCampaigns,
  getWatchlist,
  updateCampaignImage,
  getCampaignDetails,
  getTopFundRaisers,
  getCampaignRequests,
  UpdateCampaignStatus
}

