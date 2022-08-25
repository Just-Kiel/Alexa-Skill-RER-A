/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');


// TODO faire un clean et rangement propre
// TODO récupérer la station la plus proche du RER A grâce à la localisation
// TODO voir si on peut configurer des trucs au lancement de la skill et après c'est save
const logic = require('./logic');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale

        let speakOutput = "Tu as démarré la skill pour connaitre le passage du prochain RER. Dis prochain passage ou spécifie ta demande pour connaitre l'horaire !";

        if (locale === "en-US") {
            speakOutput = "You started the skill to know the headway of the next RER. Say Next headway or specify your demand to know the time !";
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const BasicIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BasicIntent';
    },
    async handle(handlerInput) {
        let response = await logic.fetchHourApi();

        // Check le premier RER qui n'est pas à l'approche ou à quai
        let result = response.result.schedules.find(x => x.message !=  "Train à l'approche" && x.message != "Train à quai");

        const locale = handlerInput.requestEnvelope.request.locale

        let speakOutput;

        if(result == undefined){
            speakOutput = "Hello, je n'ai pas trouvé de RER pour toi.";

            if (locale === "en-US") {
                speakOutput = "Hello, I didn't find any RER for you.";                
            }
        } else {
            speakOutput = "Hello, le prochain RER depuis Noisiel en direction de " + result.destination + " passe à " + result.message;

            if (locale === "en-US") {
                speakOutput = "Hello, next RER from Noisiel to " + result.destination + " will be at " + result.message;                
            }
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const DepartIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DepartIntent';
    },
    async handle(handlerInput) {
        let slotValue = handlerInput.requestEnvelope.request.intent.slots.depart.value; // ici je récupère bien l'utterance dont j'ai besoin (le départ duquel je veux être)

        let response = await logic.fetchHourApiForSpecificDeparture(slotValue);

        // Check le premier RER qui n'est pas à l'approche ou à quai
        // contains au lieu de ==
        let result = response.result.schedules.find(x => !(x.message.includes("Train à l'approche")) && !(x.message.includes("Train à quai")));

        const locale = handlerInput.requestEnvelope.request.locale

        let speakOutput;

        if(result == undefined){
            speakOutput = "Hello, je n'ai pas trouvé de RER pour toi.";

            if (locale === "en-US") {
                speakOutput = "Hello, I didn't find any RER for you.";                
            }
        } else {
            speakOutput = "Hello, le prochain RER depuis " + response.result.depart + " en direction de " + result.destination + " passe à " + result.message;

            if (locale === "en-US") {
                speakOutput = "Hello, next RER from " + response.result.depart + " to " + result.destination + " will be at " + result.message;                
            }
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const DirectionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DirectionIntent';
    },
    async handle(handlerInput) {
        let slotValue = handlerInput.requestEnvelope.request.intent.slots.destination.value; // ici je récupère bien l'utterance dont j'ai besoin (la direction vers laquelle je veux aller)

        let response = await logic.fetchHourApiForSpecificDirection(slotValue);

        // Check le premier RER qui n'est pas à l'approche ou à quai
        let result = response.result.schedules.find(x => x.message !=  "Train à l'approche" && x.message != "Train à quai");

        const locale = handlerInput.requestEnvelope.request.locale;

        let speakOutput;

        if(result == undefined){
            speakOutput = "Hello, je n'ai pas trouvé de RER pour toi.";

            if (locale === "en-US") {
                speakOutput = "Hello, I didn't find any RER for you.";                
            }
        } else {
            speakOutput = "Hello, le prochain RER depuis Noisiel en direction de " + result.destination + " passe à " + result.message;

            if (locale === "en-US") {
                speakOutput = "Hello, next RER from Noisiel to " + result.destination + " will be at " + result.message;                
            }
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {

        const locale = handlerInput.requestEnvelope.request.locale;

        let speakOutput = "Je vais t'aider mais dis moi comment ?";

        if (locale === "en-US") {
            speakOutput = "I can help you but tell me how ?";                
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {

        const locale = handlerInput.requestEnvelope.request.locale;

        let speakOutput = "Merci de m'avoir essayé !";

        if (locale === "en-US") {
            speakOutput = "Thanks for trying me !";                
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        BasicIntentHandler,
        DepartIntentHandler,
        DirectionIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();