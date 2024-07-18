//We have a lots of endpoints in a single file server.js
//Express Router is a way to modularize and organize our route handlinhg code in an Express.js application

const express=require('express');
const router= express.Router(); 
const Candidate=require('./../models/candidate.js');
const User=require('./../models/user.js');
const {jwtAuthMiddleware,generateToken} =require('./../jwt.js');

const checkAdminRole=async (userId)=>{
    try{
        const user = await User.findById(userId);
        return user.role ==='admin';
    }catch(err){
        return false;
    }
}

//post route to create a candidate
router.post('/addCandidate',jwtAuthMiddleware,async (req,res)=>{
    try{
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message:"user has not admin role"})
        }
        const data=req.body; //Assuming the request body contains the candidate data
        const newCandidate=new Candidate(data);
        const response=await newCandidate.save();
        console.log('data saved');

        res.status(200).json({response:response});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})


router.put('/updateCandidate/:candidateID',jwtAuthMiddleware, async (req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:"user has not admin role"})
        }

        const candidateID=req.params.candidateID; //Extract the id from the URL parameter
        const updatedCandidateData=req.body; //Updated data for the person
        //console.log(updatedPersonData.salary)
        const response= await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData,{
            new:true,//Return the updated document
            runValidators: true, //Run Mongoose validation
        })

        if(!response){
            return res.status(404).json({error: "Candidate not found"});
        }

        console.log("Candidate Data updated");
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})

router.delete('/deleteCandidate/:candidateID',jwtAuthMiddleware, async (req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:"user has not admin role"})
        }

        const candidateId=req.params.id; //Extract the id from the URL parameter
        
        //console.log(updatedPersonData.salary)
        const response= await Candidate.findByIdAndDelete(candidateId);

        if(!response){
            return res.status(404).json({error: "Candidate not found"});
        }

        console.log("Candidate Deleted");
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})

//Lets start voting
router.post('/vote/:candidateID',jwtAuthMiddleware,async (req, res) => {
    //No admin can vote and user can vote once
    const candidateID = req.params.candidateID
    const userId=req.user.id;

    try{
        // Find the Candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }
        if(user.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed'});
        }
        if(user.isVoted){
            return res.status(400).json({ message: 'You have already voted' });
        }

        // Update the Candidate document to record the vote
        candidate.vote.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
})

// vote count 
router.get('/vote/count', async (req, res) => {
    try{
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party age -_id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports=router;