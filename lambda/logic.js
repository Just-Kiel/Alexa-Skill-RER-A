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


// Fonction un peu évoluée : pouvoir set le départ
module.exports.fetchHourApiForSpecificDeparture = async function fetchHourApiForSpecificDeparture(start) {
    let endpoint = 'https://api-ratp.pierre-grimaud.fr';
    
    // A indique vers Paris - R indique vers Marne la Vallee - A%2BR indique les 2 directions
    let dest = 'A'; // vers Paris

    // Permet d'avoir un format propre de station
    start = start.split(" ");

    let depart = start[0];

    for(let i = 1; i<start.length; i++){
        depart += '+' + start[i];
    }
    
    let url = endpoint + '/v4/schedules/rers/A/' + depart + '/' + dest;

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

// TODO Fonction + évoluée : pouvoir set la direction (arrivée uniquement valable)
module.exports.fetchHourApiForSpecificDirection = async function fetchHourApiForSpecificDirection(destination) {
    let endpoint = 'https://api-ratp.pierre-grimaud.fr';

    let getDestination = endpoint + '/v4/destinations/rers/A';
    
    let config = {
        timeout: 6500
    }

    try {
        let responseDestination = await axios.get(getDestination, config);

        let destinationsA = responseDestination.data.result.destinations[0].name.split(" / ");

        return destinationsA[0];

        let destinationsR = responseDestination.data.result.destinations[1].name.split(" / ");

        if(destinationsA.includes(destination)){
            dest = 'A';
        } else if(destinationsR.includes(destination)){
            dest = 'R';
        } else {
            dest = null;
        }
        
        // A indique vers Paris - R indique vers Marne la Vallee - A%2BR indique les 2 directions
        // let dest = 'A'; // vers Paris

        let depart = 'Noisiel';
        
        let url = endpoint + '/v4/schedules/rers/A/' + depart + '/' + dest;

        // let config = {
        //     timeout: 6500
        // }

        try {
            let response = await axios.get(url, config);
            return  response.data;
        } catch (error) {
            console.log('ERROR', error);
            return null;
        }
    } catch (error) {
        console.log('ERROR', error);
        return null;
    }

    
}