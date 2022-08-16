var express = require('express');
var router = express.Router();
var detect=require('../shazam');
var User=require('../UserSchema');

// detect a song The raw sound data must be 44100Hz, 1 channel (Mono), signed 16 bit PCM little endian. Other types of media are NOT supported, such as : mp3, wav, e...
router.post('/detect',async function(req,res,next){
    let song=req.body.song;
    let data=await detect.detectSong(song);
    res.send(data);
});
// detect a song by name
router.post('/detectbyname',async function(req,res,next){
    let song=req.body.song;
    let data=await detect.searchSong(song);
    res.send(data);
});
module.exports = router;
