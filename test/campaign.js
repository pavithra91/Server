let chai = require('chai');
let server = require('../index');
let chaiHttp = require('chai-http');
const { response } = require('express');

// Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Campaign API', () => {

    /**
     * Test Get All Campaigns of Specific User
     */
     describe("POST /api/campaign/getCampaigns", ()=>{
        it("IT should return all Campaign details of Specific User", (done)=>{
            const id = {
                id: "lqblyRwIeylJjL6V8Chj"
            };
            chai.request(server)
            .post("/api/campaign/getCampaigns")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("success");
                response.body.should.have.property('status').should.be.a('object');
                response.body.should.have.property('msg').eq("Campaign List Found");
               done();
            })
        });

        it("IT should not return Campaign details of the User", (done)=>{
            const id = {
                id: "lqblyRwI" // Wrong User ID
            };
            chai.request(server)
            .post("/api/campaign/getCampaigns")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("error");
                response.body.should.have.property('status').should.be.a('object');
                response.body.should.have.property('msg').eq("No Campaign found");
               done();
            })
        });

        it("IT should not return Campaign details of the User", (done)=>{
            const id = {
                // No User Id
            };
            chai.request(server)
            .post("/api/campaign/getCampaigns")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(500);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("error");
                response.body.should.have.property('status').should.be.a('object');
               done();
            })
        });
    });

     /**
     * Test Get Watchlist by passing the user ID
     */
      describe("POST /api/campaign/getWatchlist", ()=>{
        it("IT should return the requested Watchlist details", (done)=>{
            const id = {
                id: "lqblyRwIeylJjL6V8Chj"
            };
            chai.request(server)
            .post("/api/campaign/getWatchlist")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("success");
                response.body.should.have.property('status').should.be.a('object');
                response.body.should.have.property('msg').eq("Watchlist Data Found");
               done();
            })
        });

        it("IT should not return the requested Campaign details", (done)=>{
            const id = {
                id: "lqblyRwI" // Wrong User ID
            };
            chai.request(server)
            .post("/api/campaign/getWatchlist")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("error");
                response.body.should.have.property('status').should.be.a('object');
                response.body.should.have.property('msg').eq("No watchlist found");
               done();
            })
        });

        it("IT should not return the requested Campaign details", (done)=>{
            const id = {
                
            };
            chai.request(server)
            .post("/api/campaign/getWatchlist")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(500);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("error");
               done();
            })
        });
    });
});