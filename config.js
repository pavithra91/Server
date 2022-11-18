// Import firebase package
const admin = require('firebase-admin');

// Import firebase Credentials
const serviceAccount = require('./donation-management-f564a-firebase-adminsdk-hg53s-47bb8926d5.json');

// Initialize Firebase app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the database
const db = admin.firestore();

// Export databse reference
module.exports = db;