//We have a lots of endpoints in a single file server.js
//Express Router is a way to modularize and organize our route handlinhg code in an Express.js application

const express=require('express');
const router= express.Router(); 
const User=require('./../models/user.js');
const {jwtAuthMiddleware,generateToken} =require('./../jwt.js')

//creating end point in which the user will send data to the server and data will be saved in the database.
router.post('/signup',async (req,res)=>{
    try{
        const data=req.body; //Assuming the request body contains the person data
        const newUser=new User(data);
        const response=await newUser.save();
        console.log('data saved');

        const payload={
            id:response.id
        }
        const token=generateToken(payload);
        //console.log(token);

        res.status(200).json({response:response,token:token});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})

 // Login route
 router.post('/login', async (req, res) => {
    try {
        // Extract aadharCardNumber and password from request body
        const { aadharCardNumber, password } = req.body;
        // Find the user by username
        const user = await User.findOne({ aadharCardNumber });
        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid aadharCardNumber or password' });
        }
        const payload = { id: user.id }
        // Generate JWT token
        const token = generateToken(payload);
        // Send token in response
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        console.log("userData: ", userData);
        // Extract user id from decoded token
        const userId = userData.id;
        console.log("User ID from token:", userId);
        // Find the user by id
        const user = await User.findById(userId);
        // If user does not exist, return error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Send user profile as JSON response
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.put('/profile/password',jwtAuthMiddleware, async (req,res)=>{
    try{
        const userId = req.user; //Extract the id from the token
        const {currentpassword,newpassword} = req.body;
        // Find the user by userId
        const user = await User.findById(userId);
        // If  password does not match, return error
        if (!(await user.comparePassword(currentpassword))) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        user.password=newpassword;
        await user.save();
        console.log("Password updated");
        res.status(200).json({msg: 'Password updated'});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})


module.exports=router;