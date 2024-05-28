const mongoose=require("mongoose")
 
const postSchema= new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        require:[true,"title is required"],
        minLength:[3,"title must be at last 3 charcter long"],

    },
    media:{
        type:String,
        require:[true],
    },
    user:{
        type:mongoose.Schema.Types.Objectid,ref:"user"
    },  
},
{timeStamp:true},
)

const Post = mongoose.model("post", postSchema);

module.exports = Post;