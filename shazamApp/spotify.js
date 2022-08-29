const { default: axios } = require("axios");
const https = require('https');
async function returnTracksByMood(mood) {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  let tracks=await axios.get('https://musicovery.com/api/V6/playlist.php?fct=getfromtag&tag='+mood,{httpsAgent})
   tracks=tracks.data.tracks.track;
   console.log(tracks);
    return tracks;
}
module.exports = {returnTracksByMood};