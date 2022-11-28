var db = require('../config');
const express = require('express');
var nodemailer = require('nodemailer');
const app = express();
app.use(express.json());
const admin = require('firebase-admin');
const fieldValue = admin.firestore.FieldValue;
const e = require('express');
const logger = require('../controller/logger')


// Get Donation Rules
const getDonationRules = async (req, res, next) => {
  try {

    const donationRulesRef = db.collection('DonationPointRules');
    const doc = await donationRulesRef.get();

    var pointlist = []
    doc.forEach(items => {
      pointlist.push(items.data());
    })

    return res.status(200).json({
      status: 'success',
      data: pointlist,
      msg: 'User Badges Found',
    });
  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}


// Update Donation Rules
const updateRule = async (req, res, next) => {
  try {

    const query = await db.collection('DonationPointRules').where('ruleName', '==', req.body.ruleName).get();

    if (!query.empty) {
      const snapshot = query.docs[0];
      const data = snapshot.data();

      const cityRef = db.collection('DonationPointRules').doc(data.id);

      const response = await cityRef.update({ min: req.body.min, max: req.body.max, points: req.body.points });

      return res.status(200).json({
        status: 'Success',
        msg: "Update Successfully",
      });
    }


    return res.status(500).json({
      status: 'Errpr',
      msg: "Update Failed",
    });

  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Delete Rule
const deleteRule = async (req, res, next) => {
  try {

    const query = await db.collection('DonationPointRules').where('ruleName', '==', req.body.ruleName).get();

    if (!query.empty) {
      const snapshot = query.docs[0];
      const data = snapshot.data();

      const res = await db.collection('DonationPointRules').doc(data.id).delete();

      return res.status(200).json({
        status: 'Success',
        msg: "Delete Rule Successfully",
      });
    }


    return res.status(500).json({
      status: 'Errpr',
      msg: "Deletion Failed",
    });

  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Add Rule
const addRule = async (req, res, next) => {
  try {
    var id = db.collection('DonationPointRules').doc().id;

    if (!req.body) {
      return res.status(400).json({
        status: 'error',
        msg: 'Body is Required',
      });
    }

    const data = {
      id: id,
      ruleName: req.body.ruleName,
      min: req.body.min,
      max: req.body.max,
      points: req.body.points,
    };

    return db.collection('DonationPointRules').doc().set(data).then(() => {
      console.log("Rule Added Sucessfully");
    });

  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Get Donation Badges
const getDonationBadges = async (req, res, next) => {
  try {

    const donationRulesRef = db.collection('Badges');
    const doc = await donationRulesRef.get();

    var badgesList = []
    doc.forEach(items => {
      badgesList.push(items.data());
    })

    return res.status(200).json({
      status: 'success',
      data: badgesList,
      msg: 'User Badges Found',
    });
  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Add Donation Badge
const addDonationBadge = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: 'error',
        msg: 'Body is Required',
      });
    }

    var id = db.collection('Badges').doc().id;

    const data = {
      id: id,
      badgeName: req.body.badgeName,
      minPoints: req.body.minPoints,
      maxPoints: req.body.maxPoints,
      badgeDescription: req.body.badgeDescription,
      imageUrl: req.body.imageUrl,
      awardingCategory: req.body.awardingCategory,
    };

    return db.collection('Badges').doc().set(data).then(() => {
      console.log("Donation Badge Added Sucessfully");
    });

  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Delete Donation Badge
const deleteDonationBadge = async (req, res, next) => {
  try {

    const query = await db.collection('Badges').where('badgeName', '==', req.body.badgeName).get();

    if (!query.empty) {
      const snapshot = query.docs[0];
      const data = snapshot.data();

      const res = await db.collection('Badges').doc(data.id).delete();

      return res.status(200).json({
        status: 'Success',
        msg: "Delete Donation Badge Successfully",
      });
    }

    return res.status(500).json({
      status: 'Errpr',
      msg: "Deletion Failed",
    });

  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Update Donation Rules
const updateBadge = async (req, res, next) => {
  try {

    const query = await db.collection('Badges').where('badgeName', '==', req.body.badgeName).get();

    if (!query.empty) {
      const snapshot = query.docs[0];
      const data = snapshot.data();

      const cityRef = db.collection('Badges').doc(data.id);

      const response = await cityRef.update({ minPoints: req.body.minPoints, maxPoints: req.body.maxPoints, badgeDescription: req.body.badgeDescription, imageUrl: req.body.imageUrl, awardingCategory: req.body.awardingCategory });

      return res.status(200).json({
        status: 'Success',
        msg: "Update Badge Details Successfully",
      });
    }

    return res.status(500).json({
      status: 'Errpr',
      msg: "Update Failed",
    });

  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Send Email
const sendEmail = async (req, res, next) => {
  try {
    const id = req.body.id;

    const cityRef = db.collection('User').doc(id);
    const doc = await cityRef.get();

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dev.pavithraj@gmail.com',
        pass: 'fitodvhabxkpcqqh'
      }
    });

    var mailOptions = {
      from: req.body.senderEmail,
      to: doc.data().email,
      subject: req.body.senderSubject,
      text: req.body.senderMessage
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
      return res.status(200).json({
        status: 'success',
        msg: 'Email Send Successfully',
      });
    });

  } catch (er) {
    console.log(er)
  }
}

// Get User Chat
const getUserChat = async (req, res, next) => {
  try {

    const id = req.body.id;
    console.log(id);

    const cityRef = db.collection('Chat').doc(id);
    const doc = await cityRef.get();

    var chatList = []
    doc.data()["message"].forEach(items => {
      chatList.push(items);
    })

    return res.status(200).json({
      status: 'success',
      data: chatList,
      msg: 'User Chat found',
    });
  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Send Chat message
const sendChatMessage = async (req, res, next) => {
  // try {

  const id = req.body.id;
  const sender = req.body.sender;
  const message = req.body.msg;

  const cityRef = db.collection('Chat').doc(id);

  var createdDate = new Date();

  const unionRes = await cityRef.update({
    message: admin.firestore.FieldValue.arrayUnion({ msg: message, sendTime: createdDate, sender: sender })
  });


  return res.status(200).json({
    status: 'success',
    data: "",
    msg: 'User Chat found',
  });
  //   } catch (er) {
  //       res.status(500).json({
  //         status: 'error',
  //         error: er,
  //       });
  //     }
}

// Get Admin Dashboard
const getAdminDashboardDetails = async (req, res, next) => {
  try {
    const dashboardRef = db.collection('Admin-Dashboard');
    const doc = await dashboardRef.get();

    var dashboard = [];
    doc.forEach(items => {
      dashboard.push(items.data());
    });

    const campaignRef = db.collection('Campaign');
    const doc2 = await campaignRef.get();

    let Pending = 0;
    let UnderReview = 0;
    let Approved = 0;
    let Rejected = 0;

    doc2.forEach(items => {
      if (items.data().campaignStatus == "Pending") {
        Pending = Pending + 1;
      }
      else if (items.data().campaignStatus == "Under Review") {
        UnderReview = UnderReview + 1;
      }
      else if (items.data().campaignStatus == "Approved") {
        Approved = Approved + 1;
      }
      else if (items.data().campaignStatus == "Rejected") {
        Rejected = Rejected + 1;
      }
    });

    let arr = Object.assign(
      { Pending: Pending },
      { UnderReview: UnderReview },
      { Approved: Approved },
      { Rejected: Rejected }
    );

    console.log(arr);
    dashboard.push(arr)

    return res.status(200).json({
      status: 'success',
      data: dashboard,
      msg: 'Dashboard Details Found',
    });
  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Post Comment
const postComment = async (req, res, next) => {
  try {

    var createdDate = new Date();

    const data = {
      userId: req.body.id,
      campaignId: req.body.campaignId,
      comment: req.body.comment,
      profileImg: req.body.profileImg,
      name: req.body.name,
      postedDate: createdDate,
    };

    return db.collection('Comments').doc().set(data).then(() => {
      console.log("Comment Posted Sucessfully");
    });
  } catch (er) {
    res.status(500).json({
      status: 'error',
      error: er,
    });
  }
}
// Post Campaign Update
const postCampaignUpdate = async (req, res, next) => {
  try {

    var createdDate = new Date();

    console.log(req.body.id);
    console.log(req.body.campaignId);
    console.log(req.body.update);
    console.log(req.body.profileImg);
    console.log(createdDate);

    const data = {
      userId: req.body.id,
      campaignId: req.body.campaignId,
      update: req.body.update,
      profileImg: req.body.profileImg,
      postedDate: createdDate,
    };

    return db.collection('Campaign-Updates').doc().set(data).then(() => {
      console.log("Comment Posted Sucessfully");
    });
  } catch (er) {
    res.status(500).json({
      status: 'error',
      error: er,
    });
  }
}

// Update Campaign Story
const updateCampaignStory = async (req, res, next) => {
  try {

    const id = req.body.id;
    const Story = req.body.story;

    const userRef = db.collection('Campaign').doc(id);
    const response = await userRef.update({ campaignDescription: Story });

    return res.status(200).json({
      status: 'success',
      msg: 'Campaign Story Updated Sucessfully',
    });

  } catch (er) {
    console.log(er);
    res.status(500).json({
      status: 'error',
      error: er,
    });
  }
}

// Get User Log
const getUserLog = async (req, res, next) => {

  let lmt = '*';//req.body.lmt;
  let fromDate = req.body.fromDate;
  let toDate = req.body.toDate;
  let level = req.body.level;

  if (level == "All") {
    level = '';
  }

  console.log(level);


  var options = {
    from: fromDate,//new Date - 24 * 60 * 60 * 1000,
    until: toDate, //new Date,
    limit: lmt,
    start: 0,
    level: level,
    order: 'desc',
    fields: ['level', 'message', 'request', 'timestamp']
  };
  logger.systemLogger.query(options, function (err, result) {
    if (err) {
      throw err;
    }

    return res.status(200).json({
      data: result,
    });
  });
}

// Get Campaign Creator Request
const getCampaaignCreatorRequest = async (req, res, next) => {
  try {

    const userRef = db.collection('User');
    const doc = await userRef.where('userStatus', '==', 'Pending').where('role', '==', 'Campaign Manager').get();

    var userlist = []
    doc.forEach(items => {
      userlist.push(items.data());
    })

    return res.status(200).json({
      status: 'success',
      data: userlist,
      msg: 'User List Found',
    });
  } catch (er) {
     res.status(500).json({
       status: 'error',
       error: er,
     });
  }
}

module.exports = {
  getDonationRules,
  updateRule,
  deleteRule,
  addRule,
  getDonationBadges,
  addDonationBadge,
  deleteDonationBadge,
  updateBadge,
  sendEmail,
  getUserChat,
  sendChatMessage,
  getAdminDashboardDetails,
  postComment,
  postCampaignUpdate,
  updateCampaignStory,
  getUserLog,
  getCampaaignCreatorRequest
}