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

    // Version jolie pour réduire avec un if ternenary
    let depart = start.reduce(
        (previousValue, currentValue, index) => 
        index!=0 ? previousValue+"+"+currentValue : currentValue
    );
    
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

// Fonction + évoluée : pouvoir set la direction (arrivée uniquement valable)
module.exports.fetchHourApiForSpecificDirection = async function fetchHourApiForSpecificDirection(destination) {
    let endpoint = 'https://api-ratp.pierre-grimaud.fr';

    let getDestination = endpoint + '/v4/destinations/rers/A';
    
    let config = {
        timeout: 6500
    }

    destination = destination.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    try {
        let responseDestination = await axios.get(getDestination, config);

        let destinationsA = responseDestination.data.result.destinations[0].name.split(" / ");

        destinationsA = destinationsA.map(destin => {
            let temp = destin.split("-");
            destin = temp[0];

            for(let i = 1; i<temp.length; i++){
                destin += ' ' + temp[i];
            }
            
            return destin.toLowerCase();
        });

        let destinationsR = responseDestination.data.result.destinations[1].name.split(" / ");

        destinationsR = destinationsR.map(destin => {
            let temp = destin.split("-");
            destin = temp[0];

            for(let i = 1; i<temp.length; i++){
                destin += ' ' + temp[i];
            }
            
            return destin.toLowerCase();
        });

        let dest = null;

        // A indique vers Paris - R indique vers Marne la Vallee - A%2BR indique les 2 directions

        // Les directions sont inversées pour la voie A (me demande pas pourquoi c'est une erreur de l'API)
        destinationsA.forEach(element => {
            if(element.includes(destination)){
                dest = 'R';
            }
        });

        destinationsR.forEach(element => {
            if(element.includes(destination)){
                dest = 'A';
            }
        });
        
        let depart = 'Noisiel';
        
        let url = endpoint + '/v4/schedules/rers/A/' + depart + '/' + dest;

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