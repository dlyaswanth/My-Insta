const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys')
const requireLogin = require('../middleware/requireLogin');
const nodemailer= require('nodemailer');
const sendMail=require('nodemailer-sendgrid-transport');

const transport=nodemailer.createTransport(sendMail({
    auth:{
        api_key:"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"
    }
}))
router.get('/',(req,res)=>{
    res.send("Hello");
})
router.get('/protected',requireLogin,(req,res)=>{
    res.send("Hello User")
})
router.post('/signup',(req,res)=>{
    const {name,email,password,pic,about}=req.body
    if (!email || !password || !name){
    return res.status(512).json({error:"Please enter each requirement"});}
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            return res.status(512).json({error:"Email Already exit"});
        }
        bcrypt.hash(password,15)
        .then(hashedpassword=>{
            const user=new User({
                name,
                email,
                about,
                password:hashedpassword,
                pic,
            })
            user.save()
            .then(user=>{
                transport.sendMail({
                to:user.email,
                from:"noreply.owner01@gmail.com",
                subject:"Welcome to myinsta",
                html:"<h1>Verfication Mail You have signed in myinsta page</h1>"
            })
               
                res.json({message:"User Saved"})
            })
            .catch(error=>{
                console.log("Error Occured ",error)
            })
    })
})
        .catch(error=>{
            console.log("Error Occured ",error)
        })
})
router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if (!email || !password){
    res.status(512).json({error:"Please add mail or Password"})}
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(512).json({error:"Invalid mail or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(!doMatch){
            return res.status(500).json({error:"Invalid mail or Password"})}
            else
            {
            const token=jwt.sign({id:savedUser.id},JWT_SECRET)
            const {id,name,email,followers,following,pic,about}=savedUser
            res.json({token,user:{id,name,email,followers,following,pic,about}})
            }
        })
        .catch(error=>{
            console.log("Error Occured ",error)
        })
    })
})
router.post('/resetpassword',(req,res)=>{
    crypto.randomBytes(16,(err,buffer)=>{
        if(err)
        {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"No User exit"})
            }
            user.resetToken=token
            user.expireToken=Date.now()+1800000
            user.save()
            .then(result=>{
                transport.sendMail({
                    to:user.email,
                    from:"noreply.owner01@gmail.com",
                    subject:"Request Reset Password",
                    html:`
                    <p>Reset Password link</p>
                    <h5>Click this<a href="http://localhost:3000/reset/${token}"></h5>
                    `
                })
                res.json({message:"Check your mail for reset link in spam / Inbox"})
            })
        })

    })
})
module.exports=router;