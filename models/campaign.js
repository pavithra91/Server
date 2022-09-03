class Campaign{
    constructor(id, campaignName, campaignStartDate, campaignEndDate, campaignDescription, goalAmount, raiedAmount, city, province, campaignStatus, dateCreated, createdBy, headerImg, mainImg, noOfDonations, shortDescription)
    {
        this.id = id;
        this.campaignName = campaignName;
        this.campaignStartDate = campaignStartDate;
        this.campaignEndDate = campaignEndDate;
        this.campaignDescription = campaignDescription;
        this.goalAmount = goalAmount;
        this.raiedAmount = raiedAmount;
        this.city = city;
        this.province = province;
        this.campaignStatus = campaignStatus;
        this.dateCreated = dateCreated;
        this.createdBy = createdBy;
        this.headerImg = headerImg;
        this.mainImg = mainImg;
        this.noOfDonations = noOfDonations;
        this.shortDescription = shortDescription;
        this.topFundraiser = false;
    }
}