//This file will be helpful for establishing connection between our nodeJs application and our MongoDB database using the mongoose library.
const mongoose = require('mongoose')
require('dotenv').config();
//Defining the mongoDB connection URL
const mongoURL=process.env.DB_URL;

//Set up MongoDB connection
mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//Get the default connection
//Mongoose maintains a default connection object represting the MongoDB connection
const db=mongoose.connection;

//Define event listeners for database connection
db.on('connected',()=>{
    console.log("Connected to MongoDB server");
})

db.on('error',(err)=>{
    console.error("MongoDB connection error:",err);
})

db.on('disconnected',()=>{
    console.log("MongoDB disconnected");
})

//Export the database connection
module.exports = db;
