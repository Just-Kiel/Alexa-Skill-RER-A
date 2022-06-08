const axios = require('axios');

// Fonction par défaut : Départ de Noisiel sur le RER A, prochain passage en direction de Paris
module.exports.fetchHourApi = async function fetchHourApi() {
    let endpoint = 'https://api-ratp.pierre-grimaud.fr';
    
    // A indique vers Paris - R indique vers Marne la Vallee - A%2BR indique les 2 directions
    let dest = 'A';
    
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


// TODO Fonction un peu évoluée : pouvoir set le départ
module.exports.fetchHourApiForSpecificDeparture = async function fetchHourApiForSpecificDeparture(start) {
    let endpoint = 'https://api-ratp.pierre-grimaud.fr';
    
    // A indique vers Paris - R indique vers Marne la Vallee - A%2BR indique les 2 directions
    let dest = 'A'; // vers Paris
    
    // if(destination === "Marne-la-Vallee Chessy" || destination === "Torcy"){
    //     dest = "R";
    // } else if(destination === "Saint-Germain-en-Laye"){
    //     dest = "A";
    // } else {
    //     dest = "A%2BR";
    // }

    start = start.split(" ");

    let depart = start[0];

    depart += start[1];

    // for(let i = 1; i<start.length; i++){
    //     depart.concat('+', start[i]);
    // }
    
    let url = endpoint + '/v4/schedules/rers/A/' + start + '/' + dest;

    let config = {
        timeout: 6500
    }

    try {
        // let response = await axios.get(url, config);
        // return  response.data;
        return depart;
    } catch (error) {
        console.log('ERROR', error);
        return null;
    }
}