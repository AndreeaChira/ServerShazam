const axios = require("axios");
const fs = require('fs');
async function detectSong(data)
{
    const options = {
        method: 'GET',
        url: 'https://shazam.p.rapidapi.com/search',
        params: {term: 'kiss the rain', locale: 'en-US', offset: '0', limit: '5'},
        headers: {
          'X-RapidAPI-Key': 'b8f9e3d12bmshcf00454d22c3c1bp1269c7jsn697baa2cf740',
          'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
        }
      };
      
    let response=await axios.request(options);
    let r=response.data;
    let data1=[];
    r.tracks.hits.forEach(element => {
        data1.push({title:element.track.title,subtitle:element.track.subtitle,href:element.track.share.href,image:element.track.images.coverart});
    });
    return data1;
}
async function searchSong(term)
{
    const options = {
        method: 'GET',
        url: 'https://shazam.p.rapidapi.com/search',
        params: {term: term, locale: 'en-US', offset: '0', limit: '5'},
        headers: {
          'X-RapidAPI-Key': 'b8f9e3d12bmshcf00454d22c3c1bp1269c7jsn697baa2cf740',
          'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
        }
      };
      
    let response=await axios.request(options);
    let r=response.data;
    let data=[];
    r.tracks.hits.forEach(element => {
        data.push({title:element.track.title,subtitle:element.track.subtitle,href:element.track.share.href,image:element.track.images.coverart});
    });
    return data;
}
async function getLinkbyNameSong(name)
{
  let apiKey='MDc1MmYxZGYtM2IxZS00YWViLThmNmItMDgyNjU3OTA4M2Vk';
  let url='https://api.napster.com/v2.2/search?apikey='+apiKey+'&query='+name+'&type=track';
  let response=await axios.get(url);
  let r=response.data;
  return r.search.data.tracks[0].previewURL;
}
async function main()
{
  let song=await getLinkbyNameSong('Dua Lipa - Don\'t Start Now');
  console.log(song);
}
main();

module.exports = {detectSong,searchSong,getLinkbyNameSong};
