/** Scryfall File
 * 
 * Contains all the functions related to interacting with the scryfall api.
 * 
 * @author Alex Malotky
 */
import { fetch } from 'wix-fetch';
import { isCommanderCard } from "backend/deckList";

const MAX_SCRYFALL_SIZE = 75;
const SCRYFALL_BULK_URI = "https://api.scryfall.com/cards/collection";
const SCRYFALL_SINGLE_URL = "https://api.scryfall.com/cards/search?q=";


/** Search Scryfall from List
 * 
 * Will go through the list chunk by chunk and return an updated list.
 * 
 * @param {Array} list - cards needed to be found on scryfall
 * @returns {Promise<Array>} Data from Scryfall
 */
export async function searchScryfalFromList(list){
    let array = [];

    for(let i=0; i<list.length; i+=MAX_SCRYFALL_SIZE){
        let chunk = list.slice(i, i+MAX_SCRYFALL_SIZE);
        array = array.concat(await processChunk(chunk));
    }

    return array;
}

/** Process Chunk
 * 
 * Formats list chunk into a request header and sends call to scryfall.
 * 
 * Sometimes the scryfall bulk search can't find a card so this function will attempt
 * a single card search for each of those cards too. 
 * 
 * @param {Array} chunk 
 * @returns {Promise<Array>} Updated Scryfall Information
 */
async function processChunk(chunk){
    let body = {
        "identifiers": []
    };

    chunk.forEach(card=>{
        let id = {
            name: card.name
        };

        if(card.set !== ""){
            id.set = card.set;

            if(card.collector_number)
                id.collector_number = String(card.collector_number);
        }

        body.identifiers.push(id);
    });

    let responce = await fetch(SCRYFALL_BULK_URI, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    });

    if(!responce.ok) {
        let error = await responce.json();
        throw new Error("Error Recieved from Scryfall:\n" + error.warnings.join("\n"));
    }
        

    let results = await responce.json();
    let data = results.data;
    
    for(let i=0; i<results.not_found.length; i++){
        let card = results.not_found[i];
        try {
            let single = await searchScryfallForSingleCard(card);
            data = data.concat(single.data);
        } catch (e) {
            if(e.message === "404"){
                card.scryfall_uris = {
                    error:{
                        errMessage: e.message
                    }
                };
                data.push(card);
            } else {
                throw e;
            }
        }
        
    }

    data.forEach(card=>{
        findAndUpdate(chunk, card);
    });

    return chunk;
}

/** Search Scryfall for Single Card
 * 
 * Performs a single card search agains scryfall.
 * 
 * @param {Object} card - contains name and set of card looking for.
 * @returns {Promise<Object>} list of possible cards.
 * @throws {Error} Scryfall Error Message
 */
export async function searchScryfallForSingleCard(card){
    let searchString = "";
    for(let attribute in card) {
        if(searchString.length !== 0)
            searchString += "+";

        searchString += attribute + ":" + card[attribute];
    }

    let uri = SCRYFALL_SINGLE_URL + encodeURIComponent(searchString);
    let responce = await fetch(uri);

    if(!responce.ok) {
        if(card.collector_number){
            delete card.collector_number;
            return await searchScryfallForSingleCard(card);
        }else if(card.set) {
            delete card.set
            return await searchScryfallForSingleCard(card);
        }

        if(responce.status === 404){
            throw new Error("404");
        } else {
            throw new Error(await responce.text());
        }
    }
        

    return await responce.json();
}

/** Update Card in List
 * 
 * Finds the card in the list and updates it.
 * 
 * @param {Array} list - list with outdated information.
 * @param {Object} card - should contain information from scryfall
 */
function findAndUpdate(list, card){
    for(let i=0; i<list.length; i++){
        if(list[i].name === card.name || card.name.includes(list[i].name)){

            list[i] = updateCard(list[i], card);
            return; //Don't keep searching through list.
        }
    }
}

/** Update Card
 * 
 * @param {Object} original
 * @param {Object} update
 * @return {Object} new card.
 */
function updateCard(original, update){
    original.name = update.name;
    original.mana_cost = update.mana_cost;
    original.type_line = update.type_line;
    original.set = update.set;

            
            
    if(update.image_status !== "missing") {

        if(typeof original.image_uris === "undefined") {
            original.image_uris = {};

            
            try {
                if(update.card_faces && update.card_faces[0].image_uris){
                    original.image_uris.front = update.card_faces[0].image_uris.normal;
                    original.image_uris.back = update.card_faces[1].image_uris.normal;
                } else {
                     original.image_uris.front = update.image_uris.normal;
                }
                
            } catch(e){
               original.image_uris = {
            error: {
                errMessage: "Unable to find image in card object."
            }
        }
            }
        }

    } else {
        original.image_uris = {
            error: {
                errMessage: "Image is currently missing in scryfall, try a different printing."
            }
        }
    }
            

    if( isCommanderCard(original) ) {
        if(update.card_faces){
            original.art = update.card_faces[0].image_uris.art_crop;
        } else {
            original.art = update.image_uris.art_crop;
        }

        original.color_identity = update.color_identity;
    }

    return original;
}