const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://shazam.p.rapidapi.com/search',
  params: {term: 'kiss the rain', locale: 'en-US', offset: '0', limit: '5'},
  headers: {
    'X-RapidAPI-Key': 'b8f9e3d12bmshcf00454d22c3c1bp1269c7jsn697baa2cf740',
    'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});