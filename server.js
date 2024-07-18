// Creating a server in NodeJs via express package 
const express=require('express')
const app=express();
const db=require('./db.js');
require('dotenv').config();

const bodyParser=require('body-parser');
app.use(bodyParser.json()); //Pick the data coming from the frontend and stores it in the request body.We dont have to care about in which format we are getting datas from the frontend , it may be raw data or json data or form data.

const PORT=process.env.PORT || 3000;



//Import the router files
const userRoutes=require('./routes/userRoutes.js')
const candidateRoutes=require('./routes/candidateRoutes.js')
//Use the routers
app.use('/',userRoutes);
app.use('/',candidateRoutes);


app.listen(PORT,function(){
    console.log(`server running on port 3000`);
})