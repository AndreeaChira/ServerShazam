const { default: axios } = require("axios");
const https = require('https');
async function returnTracksByMood(mood) {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  let tracks=await axios.get('https://musicovery.com/api/V6/playlist.php?fct=getfromtag&tag='+mood,{httpsAgent})
  console.log(tracks);
   tracks=tracks.data.tracks.track;
   console.log(tracks);
    let data=[];
    tracks.forEach(element => {
        data.push({title:element.title,subtitle:element.artist_display_name,href:"",image:""});
    });
    // only max 5 tracks
    return data.slice(0,15);
}
module.exports = {returnTracksByMood};