const express = require('express');
const {addUser, authenticate, getUser, getUserBadgeDetails, updateUserProfileImage} = require('../controller/userController');
const { create, getCampaigns, getCampaign, getWatchlist, updateCampaignImage, getCampaignDetails, getTopFundRaisers } = require('../controller/campaignController');
const { donate } = require('../controller/paymentController');

const router = express.Router();

// User Account
router.post('/user/addUser', addUser);
router.post('/user/authenticate', authenticate);
router.post('/user/getUser', getUser);
router.get('/user/getUserBadgeDetails', getUserBadgeDetails);
router.post('/user/updateUserProfileImage', updateUserProfileImage);

// Campaign
router.post('/campaign/create', create);
router.post('/campaign/getCampaigns', getCampaigns);
router.get('/campaign/getCampaign', getCampaign);
router.get('/campaign/getWatchlist', getWatchlist);
router.post('/campaign/updateCampaignImage', updateCampaignImage);
router.get('/campaign/getCampaignDetails', getCampaignDetails);
router.get('/campaign/getTopFundRaisers', getTopFundRaisers);

// Payments
router.post('/payment/donate', donate);

module.exports = {
    routes: router
}