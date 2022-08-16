var express = require('express');
var router = express.Router();
var user=require('../UserSchema');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// make a login route
router.post('/login',async function(req,res,next){
  let email=req.body.email;
  let password=req.body.password;
  let data=await user.findOne({email:email,password:password});
  if(data)
  {
    res.send({message:"Login Successful",data:data});
  }
  else
  {
    res.send({message:"Login Failed"});
  }
});
// make a register route
router.post('/register',async function(req,res,next){
  let name=req.body.name;
  let email=req.body.email;
  let password=req.body.password;
  let data=await user.findOne({email:email});
  if(data)
  {
    res.send({message:"User already exists"});
  }
  else
  {
    let data=await user.create({name:name,email:email,password:password});
    res.send({message:"User created",data:data});
  }
});
// make a add song route
router.post('/addsong',async function(req,res,next){
  let email=req.body.email;
  let password=req.body.password;
  let id=req.body.id;
  let title=req.body.title;
  let subtitle=req.body.subtitle;
  let href=req.body.href;
  let image=req.body.image;
  let data=await user.findOne({email:email,password:password});
  if(data)
  {
    let song=await user.findOne({email:email,password:password,"songs.id":id});
    if(song)
    {
      res.send({message:"Song already exists"});
    }
    else
    {
      let data=await user.findOneAndUpdate({email:email,password:password},{$push:{songs:{id:id,title:title,subtitle:subtitle,href:href,image:image}}});
      res.send({message:"Song added",data:data});
    }
  }
  else
  {
    res.send({message:"Login Failed"});
  }
});
// make a get songs route
router.post('/getsongs',async function(req,res,next){
  let email=req.body.email;
  let password=req.body.password;
  let data=await user.findOne({email:email,password:password});
  if(data)
  {
    res.send({message:"Songs fetched",data:data});
  }
  else
  {
    res.send({message:"Login Failed"});
  }
});
// make a like song route
router.post('/likesong',async function(req,res,next){
  let email=req.body.email;
  let password=req.body.password;
  let id=req.body.id;
  let data=await user.findOne({email:email,password:password});
  if(data)
  {
    let song=await user.findOne({email:email,password:password,"likedSongs.id":id});
    if(song)
    {
      res.send({message:"Song already liked"});
    }
    else
    {
      let data=await user.findOneAndUpdate({email:email,password:password},{$push:{likedSongs:{id:id}}});
      res.send({message:"Song liked",data:data});
    }
  }
  else
  {
    res.send({message:"Login Failed"});
  }
});
// make a get liked songs route
router.post('/getlikedsongs',async function(req,res,next){
  let email=req.body.email;
  let password=req.body.password;
  let data=await user.findOne({email:email,password:password});
  if(data)
  {
    res.send({message:"Liked Songs fetched",data:data});
  }
  else
  {
    res.send({message:"Login Failed"});
  }
});


module.exports = router;
