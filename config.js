const admin = require('firebase-admin');

const serviceAccount = require('./donation-management-f564a-firebase-adminsdk-hg53s-47bb8926d5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;