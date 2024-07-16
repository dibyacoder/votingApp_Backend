const mongoose=require('mongoose');
//const bcrypt=require('bcrypt');
//Define person schema
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    email:{
        type: String,
    },
    mobile:{
        type:String,
    },
    address:{
        type: String,
        required: true,
    },
    aadharCardNumber:{
        type: Number,
        required: true,
        unique: true,
    },
    role:{
        type: String,
        enum:['voter','admin'],
        default: 'voter',
    },
    isVoted:{
        type: Boolean,
        default: false,
    }

});

// create person model
const User= new mongoose.model('User',userSchema);
module.exports=User;