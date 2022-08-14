var db = require('../config');
const User = require('../models/user')
const express = require('express');
var nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

// Add user to Database
const addUser = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: 'error',
        msg: 'Body is Required',
      });
    }
    const data = req.body;
    console.log(req.body);
    return db.collection('User').doc().set(data).then(() => {
      console.log("User Added Sucessfully");

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dev.pavithraj@gmail.com',
          pass: '0718659431'
        }
      });


      var mailOptions = {
        from: 'dev.pavithraj@gmail.com',
        to: req.body.email,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }

      });

    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Authenticate User
const authenticate = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userRef = db.collection('User');
    const snapshot = await userRef.where('email', '==', email).where('password', '==', password).get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return res.status(400).json({
        status: 'error',
        msg: 'User Authenticated Failed',
      });
    }

    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());

      res.status(200).json({
        status: 'success',
        data: { 'token': doc.id, 'userName': doc.data().firstName, 'role': doc.data().role },
        msg: 'User Authenticated Sucessfully',
      });
    });
  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Get User
const getUser = async (req, res, next) => {
  try {
    const id = req.body.id;

    const cityRef = db.collection('User').doc(id);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
      return res.status(400).json({
        status: 'error',
        msg: 'No User Found',
      });
    } else {
      console.log('Document data:', doc.data());
      res.status(200).json({
        status: 'success',
        data: doc.data(),
        msg: 'User Found Sucessfully',
      });
    }

  } catch (er) {
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

// Get Badges of Specific User
const getUserBadgeDetails = async (req, res, next) => {
  try {
    const id = 'lqblyRwIeylJjL6V8Chj';//req.body.id;
    const dlevel = "Contribution Level 1"; //req.body.dlevel;

    const citiesRef = db.collection('Donation-Badges').doc(id);
    const snapshot = await citiesRef.get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    var badge = []

    snapshot.data().badge.forEach(element => {
    badge.push(element)
    });

    const badgesRef = db.collection('Badges');
    const badgelist = await badgesRef.get();
    
    var respose = [];
    badgelist.forEach(doc => {
      respose.push(doc.data())
    });

    res.status(200).json({
      status: 'success',
      data: respose,
      msg: 'User Badges Found',
    });

  } catch (er) {
    console.log(er);
    // res.status(500).json({
    //   status: 'error',
    //   error: er,
    // });
  }
}

  const updateUserProfileImage = async (req, res, next) => {
    try {
      const id = req.body.id;
      const imgPath = req.body.imgPath;
  
      const userRef = db.collection('User').doc(id);
      const response = await userRef.update({profileImg: imgPath});
  
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
  addUser,
  authenticate,
  getUser,
  getUserBadgeDetails,
  updateUserProfileImage
}