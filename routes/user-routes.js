const express = require('express');
const {addUser, authenticate, getUser, getUserBadgeDetails, updateUserProfileImage, updateUserDetails, resetPasswordSendLink, resetPassword, getAllUsers, updateBio } = require('../controller/userController');
const { create, getCampaigns, getCampaign, getWatchlist, updateCampaignImage, getCampaignDetails, getTopFundRaisers, getCampaignRequests, UpdateCampaignStatus, getCampaignByCategory, getCampaignByProvince, updateDocumentList, getAllCampaigns, removeFromWatchlist, addToWatchlist, reportCampaign } = require('../controller/campaignController');
const { donate, getAllPaymentDetails } = require('../controller/paymentController');
const { getDonationRules, updateRule, deleteRule, addRule, getDonationBadges, addDonationBadge, deleteDonationBadge, updateBadge, sendEmail, getUserChat, sendChatMessage, getAdminDashboardDetails, postComment, postCampaignUpdate, updateCampaignStory, getUserLog, getCampaaignCreatorRequest, getAllReportedCampaigns, hold_releaseCampaign } = require('../controller/miscController');

const router = express.Router();

// User Account
router.post('/user/addUser', addUser);
router.post('/user/authenticate', authenticate);
router.post('/user/getUser', getUser);
router.get('/user/getUserBadgeDetails', getUserBadgeDetails);
router.post('/user/updateUserProfileImage', updateUserProfileImage);
router.post('/user/updateUserDetails', updateUserDetails);
router.post('/user/resetPasswordSendLink', resetPasswordSendLink);
router.post('/user/resetPassword', resetPassword);
router.post('/user/getAllUsers', getAllUsers);
router.post('/user/updateBio', updateBio);

// Campaign
router.post('/campaign/create', create);
router.post('/campaign/getCampaigns', getCampaigns);
router.get('/campaign/getCampaign', getCampaign);
router.post('/campaign/getWatchlist', getWatchlist);
router.post('/campaign/updateCampaignImage', updateCampaignImage);
router.get('/campaign/getCampaignDetails', getCampaignDetails);
router.get('/campaign/getTopFundRaisers', getTopFundRaisers);
router.get('/campaign/getCampaignRequests', getCampaignRequests);
router.post('/campaign/UpdateCampaignStatus', UpdateCampaignStatus);
router.post('/campaign/getCampaignByCategory', getCampaignByCategory);
router.post('/campaign/getCampaignByProvince', getCampaignByProvince);
router.post('/campaign/updateDocumentList', updateDocumentList);
router.post('/campaign/getAllCampaigns', getAllCampaigns);
router.post('/campaign/removeFromWatchlist', removeFromWatchlist);
router.post('/campaign/addToWatchlist', addToWatchlist);
router.post('/campaign/reportCampaign', reportCampaign);

// Payments
router.post('/payment/donate', donate);
router.post('/payment/getAllPaymentDetails', getAllPaymentDetails);

// Misc
router.get('/misc/getDonationRules', getDonationRules);
router.post('/misc/updateRule', updateRule);
router.post('/misc/deleteRule', deleteRule);
router.post('/misc/addRule', addRule);
router.get('/misc/getDonationBadges', getDonationBadges);
router.post('/misc/addDonationBadge', addDonationBadge);
router.post('/misc/deleteDonationBadge', deleteDonationBadge);
router.post('/misc/updateBadge', updateBadge);
router.post('/misc/sendEmail', sendEmail);
router.post('/misc/getUserChat', getUserChat);
router.post('/misc/sendChatMessage', sendChatMessage);
router.get('/misc/getAdminDashboardDetails', getAdminDashboardDetails);
router.post('/misc/postComment', postComment);
router.post('/misc/postCampaignUpdate', postCampaignUpdate);
router.post('/misc/updateCampaignStory', updateCampaignStory);
router.post('/misc/getUserLog', getUserLog);
router.get('/misc/getCampaaignCreatorRequest', getCampaaignCreatorRequest);
router.post('/misc/getAllReportedCampaigns', getAllReportedCampaigns);
router.post('/misc/hold_releaseCampaign', hold_releaseCampaign);

module.exports = {
    routes: router
}