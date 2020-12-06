const express=require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post= mongoose.model("Post")
router.get('/postall',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedUser","name")
    .populate("comments.postedUser","name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(error=>{
    console.log("Error Occured: ",error);})
})
router.get('/getfollowpost',requireLogin,(req,res)=>{
    Post.find({postedUser:{$in:req.user.following}})
    .populate("postedUser","name")
    .populate("comments.postedUser","name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(error=>{
    console.log("Error Occured: ",error);})
})
router.post('/createpost',requireLogin,(req,res)=>{
    var {title,url,url1,location} = req.body
    if (!title || !url){
        return res.status(422).json({error:"Please add every feilds"})
    }
    req.user.password=undefined;
    url1=req.user.pic;
    const post=new Post({
      title,
      location,
      photo:url,
      pic:url1,
      postedUser:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(error=>{
        console.log("Error Occured: ",error);
    })
})
router.get('/ownpost',requireLogin,(req,res)=>{
    Post.find({postedUser:req.user._id})
    .populate("PostedUser","name")
    .then(ownpost=>{
        res.json({ownpost})
    })
    .catch(error=> {
        console.log("Error Occured: ",error)
    })
})
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedUser","name")
    .populate("postedUser","name")
    .exec((err,result)=>{
        if (err){
            return res.status(422).json({error:err})
        }
        else {
        res.json(result)}
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedUser","name")
    .populate("postedUser","name")
    .exec((err,result)=>{
        if (err){
            return res.status(422).json({error:err})
        }
        else {
        res.json(result)}
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedUser:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedUser","name")
    .populate("postedUser","name")
    .exec((err,result)=>{
        if (err){
            return res.status(422).json({error:err})
        }
        else{
        res.json(result)}
    })
})
router.put('/deletecomment',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.photoid,{
        $pull:{'comments':{_id:req.body.commentid}}
    }, {
            new:true
    })
    .populate("postedUser","name")
    .populate("comments.postedUser","name")
    .exec((err,result)=>{
        if (err){
            return res.status(422).json({error:err})
        }
        else {
        res.json(result)}
    })
})
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedUser","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedUser.id.toString() === req.user.id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
                }).catch(err=>{
                  console.log(err)
              })
        }
    })
})
module.exports= router