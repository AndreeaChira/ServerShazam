var express = require('express');
var router = express.Router();
var detect=require('../shazam');
var User=require('../UserSchema');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
var moodTracks=require('../spotify');
function getEmotionByFace(args) {
    return new Promise((resolve) => {
        const pyprog = spawn('python', [process.cwd() + '/emotion_detection.py', args]);
        pyprog.stdout.on('data', function(data)  {
            resolve(data.toString());
        });
    });
}
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

router.post('/tracksByMood',async function(req,res,next){
    const size = req.body.size;
    if(!size) {
        return res.status(400).send('No images were received');
    }
    const imgs = req.body.imgs;
    if(imgs) {
        console.log(imgs.length);
        imgs.forEach((img) => {
            // get the b64 encoded image.
            var b64img = img.substring(img.indexOf(',')+1);

            // dump b64img in b64imgs file with ';' delimitator
            fs.appendFileSync("b64imgs_emotion", b64img+';', function(err) {
                if(err) {
                    return res.status(500).send('Couldn\'t dump images for script');
                }
            })
        });
    }
    getEmotionByFace('b64imgs_emotion').then((response) => {
       
        const emotion = response.slice(0,-1);
        console.log(emotion);
        moodTracks.returnTracksByMood(emotion).then((tracks) => {
            res.send(tracks);
        })
    }).catch(err => {
        res.status(400).send(err);
    })
     .finally(() => {
        fs.unlinkSync('./b64imgs_emotion', (err) => {
            if(err) {
                console.error(err);
            }
        });
    });
});
module.exports = router;
