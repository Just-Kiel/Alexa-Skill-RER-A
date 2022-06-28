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
// Comparaison avec la speech recognition
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

    let config = {
        timeout: 6500
    }

    // Get All stations on line A
    let stations;
    try {
        let urlOfDest = 'https://api-ratp.pierre-grimaud.fr/v4/stations/rers/A';

        stations = await axios.get(urlOfDest, config);
        stations = stations.data.result.stations;
    
        let count = 2;

        let charIndex = 0;

        while (count > 1) {
            count = 0;
            for (let index = 0; index < stations.length; index++) {
                if(depart.charAt(charIndex) != stations[index].slug.charAt(charIndex)){
                    // if different on le sort des stations
                    stations.splice(index, 1); 
                    index--;
                } else {
                    count++;
                }
            }

            charIndex++;
        }
        
        let url = endpoint + '/v4/schedules/rers/A/' + stations[0].slug + '/' + dest;

        try {
            let response = await axios.get(url, config);
            response.data.result.depart = stations[0].name;
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

// Fonction + évoluée : pouvoir set la direction (arrivée uniquement valable)
// TODO pouvoir préciser une autre station que l'arrivée (avec des détections tout ça) devoir utiliser la requete pour avoir toutes les stations et ainsi savoir où je suis par rapport à où
module.exports.fetchHourApiForSpecificDirection = async function fetchHourApiForSpecificDirection(destination) {
    let endpoint = 'https://api-ratp.pierre-grimaud.fr';

    let getDestination = endpoint + '/v4/destinations/rers/A';
    
    let config = {
        timeout: 6500
    }

    // J'enleve les accents pour pouvoir comparer de manière propre
    destination = destination.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    try {
        let responseDestination = await axios.get(getDestination, config);

        // Recupération des destinations dans un sens (nommé sens A mais en fait sens R car le monsieur de l'API a fait n'importe quoi)
        let destinationsA = responseDestination.data.result.destinations[0].name.split(" / ");

        destinationsA = destinationsA.map(destin => {
            let temp = destin.split("-");

            destin = temp.reduce(
                (previousValue, currentValue, index) => 
                index!=0 ? previousValue+" "+currentValue : currentValue
            );
            
            // Format minuscule sans tiret et avec des espaces
            return destin.toLowerCase();
        });

        let destinationsR = responseDestination.data.result.destinations[1].name.split(" / ");

        destinationsR = destinationsR.map(destin => {
            let temp = destin.split("-");
            destin  = temp.reduce(
                (previousValue, currentValue, index) => 
                index!=0 ? previousValue+" "+currentValue : currentValue
            );
            
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