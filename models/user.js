const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
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
    password:{
        type: String,
        required: true,
    },
    isVoted:{
        type: Boolean,
        default: false,
    }

});

userSchema.pre('save',async function(next){
    const person= this;
    //Hash the password only if it has been modifies (or is new)
   if(!person.isModified('password')) return next();
   try{
       //hash password generation
       const salt=await bcrypt.genSalt(10);
       //Hash password
       const hashedPassword=await bcrypt.hash(person.password,salt);
       //Override the plain password with the hashed one
       person.password=hashedPassword;

       next();
   }catch(err){
       return next(err);
   }
   
})

userSchema.methods.comparePassword = async function(candidatePassword){
   try{
       const isMatch= await bcrypt.compare(candidatePassword,this.password);
       return isMatch;
   }catch(err){
       throw err;
   }
}

// create person model
const User= new mongoose.model('User',userSchema);
module.exports=User;