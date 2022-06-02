const axios = require('axios');

module.exports.fetchHourApi = async function fetchHourApi(destination) {
    let endpoint = 'https://api-ratp.pierre-grimaud.fr';
    
    if(destination == "Marne-la-Vallee Chessy"){
        let dest = "R";
    }
    
    let url = endpoint + '/v4/schedules/rers/A/Noisiel/' + dest;

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