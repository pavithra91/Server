let chai = require('chai');
let server = require('../index');
let chaiHttp = require('chai-http');
const { response } = require('express');

// Assertion Style
chai.should();

chai.use(chaiHttp);

describe('User API', () => {

    /**
     * Test Get User by ID
     */
    describe("POST /api/user/getUser", ()=>{
        it("Get specific User by ID", (done)=>{
            const id = {
                id: "lqblyRwIeylJjL6V8Chj"
            };
            chai.request(server)
            .post("/api/user/getUser")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("success");
                response.body.should.have.property('status').should.be.a('object');
               done();
            })
        });

        it("Get specific User by providing wrong User ID", (done)=>{
            const id = {
                id: "lqblyRwIeylJjL6V8Ch"
            };
            chai.request(server)
            .post("/api/user/getUser")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(400);
                response.body.should.be.a('object');
               done();
            })
        })
    })


    /**
     * Authenticate User
     */
     describe("POST /api/user/authenticate", ()=>{
        it("Authenticate User by correct username and password", (done)=>{
            const id = {
                email: "pavidsscst@gmail.com",
                password: "pass#word1"
            };
            chai.request(server)
            .post("/api/user/authenticate")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("success");
                response.body.should.have.property('msg').eq("User Authenticated Sucessfully");
               done();
            })
        });

        it("Authenticate user by wrong email", (done)=>{
            const id = {
                email: "saviru@gmail.com",
                password: "pass#word1"
            };
            chai.request(server)
            .post("/api/user/authenticate")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("error");
                response.body.should.have.property('msg').eq("User Authenticated Failed");
               done();
            })
        });

        it("Authenticate user by wrong password", (done)=>{
            const id = {
                email: "pavidsscst@gmail.com",
                password: "pass#word2"
            };
            chai.request(server)
            .post("/api/user/authenticate")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("error");
                response.body.should.have.property('msg').eq("User Authenticated Failed");
               done();
            })
        })
    });


    /**
     * Get All Users by role and status
     */
     describe("POST /api/user/getAllUsers", ()=>{
        it("Get All Users by all parameter", (done)=>{
            const id = {
                role: "All",
                status: "All"
            };
            chai.request(server)
            .post("/api/user/getAllUsers")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("success");
                response.body.should.have.property('msg').eq("User List Found");
               done();
            })
        });

        it("Get All Users by passing one role and all statuses", (done)=>{
            const id = {
                role: "Administrator",
                status: "All"
            };
            chai.request(server)
            .post("/api/user/getAllUsers")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("success");
                response.body.should.have.property('msg').eq("User List Found");
               done();
            })
        });
        it("Get All Users by role and status", (done)=>{
            const id = {
                role: "Administrator",
                status: "Active"
            };
            chai.request(server)
            .post("/api/user/getAllUsers")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("not found");
                response.body.should.have.property('msg').eq("User List Not Found");
               done();
            })
        });
        it("Get All Users by passing null values", (done)=>{
            const id = {
                role: null,
                status: null
            };
            chai.request(server)
            .post("/api/user/getAllUsers")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("not found");
                response.body.should.have.property('msg').eq("User List Not Found");
               done();
            })
        });

        it("Get All Users without passing parameters", (done)=>{
            const id = {
            };
            chai.request(server)
            .post("/api/user/getAllUsers")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(500);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("error");
               done();
            })
        })
    });


    /**
     * Add User
     */
     describe("POST /api/user/addUser", ()=>{
        it.skip("Add User", (done)=>{
            const id = {
                firstName: "Dilhan",
                lastName: "Dahanayake",
                email: "buxmail138@gmail.com",
                password: "pass#word1",
                role: "Campaign Manager"
            };
            chai.request(server)
            .post("/api/user/addUser")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq("success");
                response.body.should.have.property('msg').eq("User Created Sucessfully");
               done();
            })
        });

        it("Add User without passing parameters", (done)=>{
            const id = {

            };
            chai.request(server)
            .post("/api/user/addUser")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(500);
                response.body.should.be.a('object');
               done();
            })
        })

        it("Add User by already exists Email", (done)=>{
            const id = {
                firstName: "Dilhan",
                lastName: "Dahanayake",
                email: "test@gmail.com",
                password: "pass#word1",
                role: "Campaign Manager"
            };
            chai.request(server)
            .post("/api/user/addUser")
            .send(id)
            .end((err, response)=>{
                response.should.have.status(500);
                response.body.should.be.a('object');
               done();
            })
        })
    }); 
});