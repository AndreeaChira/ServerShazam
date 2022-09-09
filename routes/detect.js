var express = require('express');
var router = express.Router();
var detect=require('../shazam');
var user=require('../UserSchema');
var multer=require('multer');
var User=require('../UserSchema');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
var moodTracks=require('../spotify');
var request = require("request");
var id='';
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
const storage=multer.diskStorage({
    destination:function(req,file,cb) {
      cb(null,"./")
    },
    filename:function(req,file,cb)
    {
      console.log(file)
      cb(null,"b64imgs_emotion.txt")
    }
  })
  const storage2=multer.diskStorage({
    destination:function(req,file,cb) {
      cb(null,"./public/")
    },
    filename:function(req,file,cb)
    {
      console.log(file);
        id=makeid(16)+file.originalname;
      cb(null,id)
    }
  })
  
  
  const upload=multer({storage:storage})

  const upload2=multer({storage:storage2})

  function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    let b64= new Buffer(bitmap).toString('base64');
    // save to file
    fs.writeFileSync('b64imgs_emotion.txt', b64);

}
function base64_encode_get(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    let b64= new Buffer(bitmap).toString('base64');
    // save to file
   return b64;

}




function getEmotionByFace(args) {
    return new Promise((resolve) => {
        const pyprog = spawn('python3', [process.cwd() + '/emotion_detection.py', args]);
        pyprog.stdout.on('data', function(data)  {
           
        });
        // on close
        pyprog.on('close', (code) => {
            // read emotion from file
            let emotion=fs.readFileSync('emotion.txt');
            resolve(emotion.toString());
        });
    });
}
// detect a song The raw sound data must be 44100Hz, 1 channel (Mono), signed 16 bit PCM little endian. Other types of media are NOT supported, such as : mp3, wav, e...
router.post('/detect',upload2.single('audio'),async function(req,res,next){

    var data = {
        'url': 'http://20.216.139.114:3000/'+id,
        'return': 'apple_music,spotify',
        'api_token': '21dbab18765b2c242a5113d21270f03f'
    };
    request({
        uri: 'https://api.audd.io/',
        form: data,
        method: 'POST'
      }, function (err, res1, body) {
        console.log(body);
        let bodyu=JSON.parse(body);

        let element=bodyu["result"];
        if(element!=null)
        {
        console.log(element);
        let song={title:element.title,subtitle:element.artist,href:"",image:""};
        //add to user "andreea@gmail.com" the song
        user.findOneAndUpdate({email:"andreea@gmail.com"},{$push:{songs:song}}).then((data)=>{
            console.log(data);
     
            res.send([{title:element.title,subtitle:element.artist,href:"",image:""}])
        })
    } else {
        res.send([]);
    }

    
    });
});
// detect a song by name 
router.post('/detectbyname',async function(req,res,next){
    let song=req.body.song;
    let data=await detect.searchSong(song);
    res.send(data);
});
// get link by name song (author - name)
router.post('/getlinkbynamesong',async function(req,res,next){
    console.log(req.body);
    let song=req.body.nameSong; 
    console.log(song);
    let data=await detect.getLinkbyNameSong(song);
    console.log(data);
    res.send({nameSong:data});
});

router.post('/tracksByMood',upload.single('image'),async function(req,res,next){
    console.log(req.file);
    base64_encode("b64imgs_emotion.txt");
        // dump b64img in b64imgs file with ';' delimitator
        fs.appendFileSync("b64imgs_emotion.txt", ';', function(err) {
            if(err) {
                console.log(err);
                return res.status(400).send('Couldn\'t dump images for script');
            }
        });
    getEmotionByFace('b64imgs_emotion.txt').then((response) => {
        console.log(response);
        moodTracks.returnTracksByMood(response).then((tracks) => {
            console.log(tracks);
            // find user by email
            User.findOne({email: "andreea@gmail.com"}).then((user) => {
                // add tracks to user
                user.songs=tracks;
                res.send(user);
            });
        })
    }).catch(err => {
        res.status(400).send(err);
    })
     .finally(() => {
        fs.unlinkSync('./b64imgs_emotion.txt', (err) => {
            if(err) {
                console.log(err);
                console.error(err);
            }
        });
    });
});
router.post('/trackMood',upload.single('image'),async function(req,res,next){
        console.log(req.file);
        base64_encode("b64imgs_emotion.txt");
            // dump b64img in b64imgs file with ';' delimitator
            fs.appendFileSync("b64imgs_emotion.txt", ';', function(err) {
                if(err) {
                    console.log(err);
                    return res.status(400).send('Couldn\'t dump images for script');
                }
            });
    getEmotionByFace('b64imgs_emotion.txt').then((response) => {
       console.log(response);
        res.send({emotion:response});
    }).catch(err => {
        console.log(err);
        res.status(400).send(err);
    })
});
module.exports = router;
