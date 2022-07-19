var db = require('./config');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user-routes');
const app=express();
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes.routes);


app.listen(3000,()=>console.log("Listning to port 3000"));