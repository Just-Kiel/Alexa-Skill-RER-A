const axios = require('axios');

module.exports.fetchJokesApi = async function fetchJokesApi() {
    let endpoint = 'http://api.icndb.com';
    let url = endpoint + '/jokes/random';

    let config = {
        timeout: 6500
    }

    try {
        let response = await axios.get(url, config);
        return  response.data;
    } catch (error) {
        console.log('ERROR', error);
        return null;
    }
}