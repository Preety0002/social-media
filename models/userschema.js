const mongoose=require("mongoose")
const  plm=require("passport-local-mongoose")

const userschema=new mongoose.Schema({

    profilepic:{
        type:String,
        default:"default.png",
    },
    name:{
        type:String,
        trim:true,
        require:[true,"user is required"],
        minLength:[4,"user atlest 4 car"],
    },
    username:{
        type:String,
        trim:true,
        require:[true,"user is required"],
        minLength:[4,"user atlest 4 car"],
    },
    email:{
    type:String,
    trime:true,
    unique:true,
    lowercase:true,
    require:[true,"email is req"],
    },
    password:String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    resetPasswordToken: {
        type: Number,
        default: 0,
    },
},
{timestamps:true}

);
userschema.plugin(plm)
const user=mongoose.model("user",userschema)
module.exports=user

