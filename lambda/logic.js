const axios = require('axios');

module.exports.fetchHourApi = async function fetchHourApi() {
    let endpoint = 'https://api-ratp.pierre-grimaud.fr';
    let url = endpoint + '/v4/schedules/rers/A/Noisiel/R';

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