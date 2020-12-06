const mongoose = require('mongoose');
const {ObjectId}=mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        reqiured:true
    },
    email: {
        type:String,
        required:true
    },
    password:{
        type:String,
        reqiured:true
    },
    createdAt:{
        type:Date,
    },
    resetToken:String,
    expireToken:Date,
    about:{
        type:String,
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/yash06/image/upload/v1607009785/avatar-default-icon_gfftkl.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})
mongoose.model("User",userSchema);