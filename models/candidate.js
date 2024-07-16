const mongoose=require('mongoose');
//const bcrypt=require('bcrypt');
//Define person schema
const candidateSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    party:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    vote:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt:{
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount:{
        type: Number,
        default:0
    }

});

// create person model
const Candidate= new mongoose.model('Candidate',candidateSchema);
module.exports=Candidate;