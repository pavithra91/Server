var db = require('../config');
const express = require('express');
var nodemailer = require('nodemailer');
const app = express();
app.use(express.json());


// Get Donation Rules
const getDonationRules = async (req, res, next) => {
    try {

        const donationRulesRef = db.collection('DonationPointRules');
        const doc = await donationRulesRef.get();

        var pointlist = []
        doc.forEach(items =>{
            pointlist.push(items.data());
        })

       return  res.status(200).json({
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

            const response = await cityRef.update({min: req.body.min, max: req.body.max, points: req.body.points});

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

            const res = await db.collection('cities').doc(data.id).delete();

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
        doc.forEach(items =>{
            badgesList.push(items.data());
        })

       return  res.status(200).json({
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
      
      transporter.sendMail(mailOptions, function(error, info){
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


module.exports = {
    getDonationRules,
    updateRule,
    deleteRule,
    addRule,
    getDonationBadges,
    sendEmail
  }