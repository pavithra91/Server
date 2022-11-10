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

    var createdDate = new Date();

    User.firstName = req.body.firstName;
    User.lastName = req.body.lastName;
    User.email = req.body.email;
    User.password = req.body.password;
    User.nic = "";
    User.dob = "";
    User.phone = "";
    User.role = req.body.role;
    User.userStatus = "Pending";
    User.dateCreated = createdDate;
    User.city = "";
    User.address = "";
    User.donationLevel = "";
    User.donationPoints = 0;
    User.profileImg = "";

    const createdUser = await db.collection('User').add(User);

    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      auth: {
        user: 'dev.pavithraj@gmail.com',
        pass: 'zaqyfidgkfttfxph'
      }
    });

    var mailOptions = {
      from: 'dev.pavithraj@gmail.com',
      to: req.body.email,
      subject: 'Welcome to Charity',
      html: 'Hello ' + req.body.firstName + ' ' + req.body.lastName + ', <br /><br /> Thank you for signing up to Charity! We \'re excited to have you onboard and will be happy to help you set everything up.  Please confirm your email (' + req.body.email + ') by clicking the button below.'
    };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //      return console.log(error);
    //    }
    //   console.log('Message sent: %s', info.messageId);

    return res.status(200).json({
      status: 'success',
      data: createdUser.id,
      msg: 'User Created Sucessfully',
    });

    //   });


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
    const id = req.query.id;

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
    const response = await userRef.update({ profileImg: imgPath });

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

// Update User Details
const updateUserDetails = async (req, res, next) => {
  try {
    const id = req.body.id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const address = req.body.address;
    const city = req.body.city;

    console.log(req.body.id);
    console.log(req.body.firstName);

    const userRef = db.collection('User').doc(id);
    const response = await userRef.update({ firstName: firstName, lastName: lastName, phone: phone, address: address, city: city });

    return res.status(200).json({
      status: 'success',
      msg: 'User Profile Update Sucessfully',
    });

  } catch (er) {
    console.log(er);
    //   res.status(500).json({
    //     status: 'error',
    //     error: er,
    //   });
  }
}

// Reset Password
const resetPasswordSendLink = async (req, res, next) => {
  try {
    const email = req.body.email;

    console.log(req.body.email);

    const userRef = db.collection('User');
    const snapshot = await userRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return res.status(400).json({
        status: 'error',
        msg: 'User Account not Found',
      });
    }

    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());

      console.log(doc.id);

      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
          user: 'dev.pavithraj@gmail.com',
          pass: 'zaqyfidgkfttfxph'
        }
      });

      var mailOptions = {
        from: 'dev.pavithraj@gmail.com',
        to: req.body.email,
        subject: 'Charity Account Password Reset',
        html: '<p><strong>Hello '+ doc.firstName +', <br /> </strong></p><p>&nbsp;</p><p>You can reset your account password by clicking below link</p><br /> <p><a href="http://localhost:8080/ResetPasswrod/'+ doc.id +'" target="_blank">Reset Password</a></p><p>&nbsp;</p><br /> <p>Thanks and Regards,</p><p>Charity Team</p>'
      };

       transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            return console.log(error);
          }
         console.log('Message sent: %s', info.messageId);

      return res.status(200).json({
        status: 'success',
        data: "",
        msg: 'User Created Sucessfully',
      });
    });
  });

  } catch (er) {
    console.log(er);
    //   res.status(500).json({
    //     status: 'error',
    //     error: er,
    //   });
  }
}

// Update User Details
const resetPassword = async (req, res, next) => {
  try {
    const id = req.body.id;
    const password = req.body.password;

    console.log(req.body.id);
    console.log(req.body.password);

    const userRef = db.collection('User').doc(id);
    const response = await userRef.update({ password: password });

    return res.status(200).json({
      status: 'success',
      msg: 'Password Updated',
    });

  } catch (er) {
    console.log(er);
    //   res.status(500).json({
    //     status: 'error',
    //     error: er,
    //   });
  }
}

// Get All Users
const getAllUsers = async (req, res, next) => {
  try {
    let _UserRole = req.body.role;
    let _UserStatus = req.body.status;

    console.log(_UserRole);
    console.log(_UserStatus);

    const userRef = db.collection('User');
    let snapshot = null;

    if(_UserRole == "All")
    {  
      if(_UserStatus == "All"){
        snapshot = await userRef.get(); 
      }
      else{
        snapshot = await userRef.where('role', 'in', ['Donor', 'Campaign Manager', 'Administrator', 'Staff']).where('userStatus', '==', _UserStatus).get();
      }
    }
    else
    {
      if(_UserStatus == "All"){
        snapshot = await userRef.where('role', '==', _UserRole).where('userStatus', 'in', ['Active', 'Block']).get();
      }
      else{
        console.log("Else Part")
        snapshot = await userRef.where('role', '==', _UserRole).where('userStatus', '==', _UserStatus).get();
      }
    }

    var _userlist = [];
    
    if (snapshot.empty) {
      return res.status(200).json({
        status: 'success',
        data: _userlist,
        msg: 'User List Not Found',
      });
    }

    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      _userlist.push(doc.data())
    });

    return res.status(200).json({
      status: 'success',
      data: _userlist,
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
  addUser,
  authenticate,
  getUser,
  getUserBadgeDetails,
  updateUserProfileImage,
  updateUserDetails,
  resetPasswordSendLink,
  resetPassword,
  getAllUsers
}