class Payment{
    constructor(campaignId, amount, donorName, message, paymentStatus, dateCreated, donationStatus, trxref)
    {
        this.campaignId = campaignId;
        this.amount = amount;
        this.donorName = donorName;
        this.message = message;
        this.paymentStatus = paymentStatus;
        this.dateCreated = dateCreated;
        this.donationStatus = donationStatus;
        this.trxref = trxref;
    }
}