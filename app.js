const express =require('express');
const app=express();
const PORT=process.env.PORT ||9000;
const mongoose=require('mongoose');
const {MONGOURI}=require('./config/keys');
const customMid = (req,res,next)=>{
    next();
}
mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
    console.log("Connected to dataBase");
})
mongoose.connection.on('error',(error)=>{
    console.log("Error Connecting : ",error);
})
require('./models/user');
require('./models/post')
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'))
if(process.env.NODE_ENV=="production"){
    app.use(express.static('frontend/build'))
        const path=require('path')
        app.get("*",(req,res)=>{
            res.sendFile(path.resolve(_dirname,'frontend','build','index.html'))
        })
        }
app.listen(PORT,()=>{
   console.log("Server on ",PORT); 
})