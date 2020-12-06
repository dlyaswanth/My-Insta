const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title:{
        type:String ,
        required:true
    },
    location:{
        type:String,
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{
        type:ObjectId,ref:"User"
    }],
    pic:{
        type:String,
        ref:"User.pic"
    },
    comments:[{
        text:String,
        postedUser:{type:ObjectId,ref:"User"}
    }],
    postedUser:{
        type:ObjectId,
        ref:"User"
      }
},{timestamps:true})
mongoose.model("Post",postSchema)