var db = require('../config');
const Campaign = require('../models/campaign')
const express = require('express');
const app = express();
app.use(express.json());
const admin = require('firebase-admin');
const fieldValue = admin.firestore.FieldValue; 


// Create Campaign
const create = async (req, res, next) => {
  try {
    // Check if the request body is empty
    if (!req.body) {
      return res.status(400).json({
        status: 'error',
        msg: 'Body is Required',
      });
    }
    const data = req.body;

    var createdDate = new Date();
    console.log(createdDate.toISOString().slice(0, 10));

    // Create dummy ID for campaign
    var id = db.collection('Campaign').doc().id;

    // Map request parameters to Campaign object
    Campaign.campaignName = req.body.campaignName;
    Campaign.campaignStartDate = req.body.campaignStartDate;
    Campaign.campaignEndDate = req.body.campaignEndDate;
    Campaign.campaignDescription = req.body.campaignDescription;
    Campaign.goalAmount = parseFloat(req.body.goal);
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

    // Add Campaign object as a document to firebase
    const snapshot = await db.collection('Campaign').doc(id).set(Campaign).then(() => {
      console.log("Campaign Created Sucessfully");
    });

    // Create relavent campaign request document
    const campaignStatusData = {
      campaignstatus: 'Request  ',
      approvedBy: '',
      comment: '',
      approvedDate: ''
    };

    // Send respose to user
    const respose = await db.collection('CampaignApproval').doc(id).set(campaignStatusData).then(() => {
      return res.status(200).json({
        status: 'Success',
        data: id,
        msg: 'Campaign Created Sucessfully',
      });
    });
  } catch (error) {
    return res.status(500).send(error.message);
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
      return res.status(400).json({
        status: 'error',
        msg: 'No Campaign found',
      });
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
     res.status(500).json({
       status: 'error',
       error: er,
     });
  }
}

// Get Campaign
const getCampaign = async (req, res, next) => {
  try {
    let id = req.query.id;

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
    const id = req.body.id;
    console.log(id);

    const cityRef = db.collection('Watchlist').doc(id);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
      return res.status(400).json({
        status: 'error',
        msg: 'No watchlist found',
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
     res.status(500).json({
       status: 'error',
       error: er,
     });
  }
}

// Update Campaign images
const updateCampaignImage = async (req, res, next) => {
  try {
    const id = req.body.id;
    const mainImgSrc = req.body.mainImgSrc;

    console.log(id);
    // console.log(imgPath);
    console.log(mainImgSrc);

    const userRef = db.collection('Campaign').doc(id);
    const response = await userRef.update({ mainImg: mainImgSrc });

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
      _response.push(_commentlist);
    }
    else {
      commentResponse.forEach(doc => {
       // console.log(doc.id, '=>', doc.data());
        _commentlist.push(doc.data())
      });

      _response.push(_commentlist);
    }

    const faqRef = db.collection('FAQ');
    const faqResponse = await faqRef.where('campaignId', '==', id).get();

    if (faqResponse.empty) {
      console.log('No matching documents for FAQs.');
      _response.push(_faqlist);
    }
    else {
      faqResponse.forEach(doc => {
       // console.log(doc.id, '=>', doc.data());
        _faqlist.push(doc.data())
      });
      _response.push(_faqlist);
    }

    const updatesRef = db.collection('Campaign-Updates');
    const updatesResponse = await updatesRef.where('campaignId', '==', id).get();

    if (updatesResponse.empty) {
      console.log('No matching documents for recent updates.');
      _response.push(_updateslist);
    }
    else {
      updatesResponse.forEach(doc => {
    //    console.log(doc.id, '=>', doc.data());
        _updateslist.push(doc.data());
      });
      _response.push(_updateslist);
    }

    console.log(_response);

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
    
    const citiesRef = db.collection('Campaign');
    const snapshot = await citiesRef.where('topFundraiser', '==', true).get();
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
    let status = req.query.status;

    const campaignRequestRef = db.collection('Campaign');
    let snapshot = null;
    if(status == "All")
    {
      snapshot = await campaignRequestRef.where('campaignStatus', 'in', ['Approved', 'Request', 'Under Review', 'Rejected']).get();  
    }
    else
    {
      snapshot = await campaignRequestRef.where('campaignStatus', 'in', [status]).get();
    }

    var campaignlist = [];

    if (snapshot.empty) {
      return res.status(200).json({
        status: 'success',
        data: campaignlist,
        msg: 'Campaign List Not Found',
      });
    }

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
     res.status(500).json({
       status: 'error',
       error: er,
     });
  }
}

// Update Campaign Status
const UpdateCampaignStatus = async (req, res, next) => {
  try {
    const id = req.body.id;
    const reqStatus = req.body.reqStatus;
    const reqComment = req.body.reqComment;
    const userId = req.body.userId;

    console.log(userId);

    const campaignRef = db.collection('Campaign').doc(id);
    const resCampaign = await campaignRef.update({ campaignStatus: reqStatus });

    var createdDate = new Date();
    console.log(createdDate.toISOString().slice(0, 10));

    const campaignStatusRef = db.collection('CampaignApproval').doc(id);
    const resCampaignStatus = await campaignStatusRef.update({ campaignstatus: reqStatus, comment: reqComment, approvedDate: createdDate.toISOString().slice(0, 10), approvedBy: userId });

    console.log(resCampaign);

    return res.status(200).json({
      status: 'success',
      msg: 'Update Sucessfully',
    });

  } catch (er) {
    console.log(er);
    res.status(500).json({
      status: 'error',
      error: er,
    });
  }
}

// Get Campaigns by Category
const getCampaignByCategory = async (req, res, next) => {
  try {
    const category = req.body.category;
    console.log(category);
    const citiesRef = db.collection('Campaign');
    const snapshot = await citiesRef.where('category', 'in', [category]).get();
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
    res.status(500).json({
      status: 'error',
      error: er,
    });
  }
}

// Update Campaign images
const updateDocumentList = async (req, res, next) => {
  try {
    const id = req.body.id;
    const docUrl = req.body.docUrl;

    console.log(req.body.docUrl);

    const userRef = db.collection('Campaign').doc(id);

    const unionRes = await userRef.update({
      documentList: fieldValue.arrayUnion(docUrl)
    });

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

// Get All Campaign List
const getAllCampaigns = async (req, res, next) => {
  try {
    let _campaignStatus = req.body.status;
    let fromDate = new Date(req.body.fromDate);
    let toDate = new Date(req.body.toDate);

    console.log(fromDate);

    const campaignRequestRef = db.collection('Campaign');
    let snapshot = null;
    if(_campaignStatus == "All")
    {
      snapshot = await campaignRequestRef.where('dateCreated', '>=', fromDate).where('dateCreated', '<=', toDate).get();  
    }
    else
    {
      snapshot = await campaignRequestRef.where('campaignStatus', 'in', [_campaignStatus]).where('dateCreated', '>=', fromDate).where('dateCreated', '<=', toDate).get();
    }
    
    var campaignlist = [];
    if (snapshot.empty) {
      return res.status(200).json({
        status: 'success',
        data: campaignlist,
        msg: 'User List Not Found',
      });
    }

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
  UpdateCampaignStatus,
  getCampaignByCategory,
  updateDocumentList,
  getAllCampaigns
}

