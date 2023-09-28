/** Cache File
 * 
 * Contains all the functions need for inserting, updating, and deleting
 * infromation from the cache stored in MyDeck collection.
 * 
 * @author Alex Malotky
 * 
 */
import { getTypeFromLine, isCommanderCard, colorsOfCard } from "backend/deckList.js";

/** Import Cache
 *
 * Creates a cache object from a string that has been created with sierialize.
 * 
 * @param {String} string 
 * @returns Cache object
 */
export function importCache(string){
    try {
        return JSON.parse(string);
    } catch(e) {
        //If cache is corupted, create new one.
        return createNewCache();
    }
}

/** Create New Cache
 * 
 * Creates a new cache from a wireframe needed for update and insert functions.
 * 
 * @returns Cache object
 */
export function createNewCache(){
    return {
        commanders: [],
        mainDeck: {}
    };
}

/** Update Cache
 * 
 * Adds any cards not in the cache from the decklist and removes any cards
 * in the cache not in the decklist.
 * 
 * @param {any} cache 
 * @param {Array<any>} deckList
 */
export function updateCache(cache, deckList){
    
    //Add cards not found in the cache.
    deckList.forEach(card=>{
        if(isCommanderCard(card)) {
            if( findCard(cache.commanders, card) === -1) {
                cache.commanders.push(card);
            }

        } else {
            let category = getTypeFromLine(card.type_line);
            if(category === "Unknown") {
                category = getTypeFromLine(card.section);
            }
            
            if(typeof cache.mainDeck[category] === "undefined") {
                cache.mainDeck[category] = [];
            }

            if( findCard(cache.mainDeck[category], card) === -1) {
                cache.mainDeck[category].push(card);
            }
        }
    });
    
    //Remvoe cards from cache not in decklist
    cache.commanders = cache.commanders.filter(card=>{
        return findCard(deckList, card) !== -1;
    });

    for(let catagory in cache.mainDeck){
        cache.mainDeck[catagory] = cache.mainDeck[catagory].filter(card=>{
            return findCard(deckList, card) !== -1;
        });
    }

}

/** Inserts list cache
 * 
 * Adds any cards not in the cache from the decklist and removes any cards
 * in the cache not in the decklist.
 * 
 * @param {any} cache 
 * @param {Array<any>} updates
 */
export function insertIntoCache(cache, updates){
    updates.forEach(card=>{

        if(isCommanderCard(card)) {
            let index = findCard(cache.commanders, card);
            cache.commanders[index] = card;

        } else {
            let category = getTypeFromLine(card.type_line);

            if(typeof cache.mainDeck[category] === "undefined")
                cache.mainDeck[category] = [];

            let index = findCard(cache.mainDeck[category], card);
            if(index === -1){
                cache.mainDeck[category].push(card);

                //Remove old card from unknown list
                let i = findCard(cache.mainDeck.Unknown, card)
                if(i > -1){
                    cache.mainDeck.Unknown.splice(i, 1);
                }
            } else {
                cache.mainDeck[category][index] = card;
            }
        }
    });

}

/** Find Cards in list by Name and Set and Collector Number
 * 
 * For effency purposes this funciton will update card count and if the card
 * is foil.
 *
 * @param {Array<any>} list 
 * @param {Object} card 
 * @returns {Number}
 */
function findCard(list, card){
    if(typeof list === "undefined")
        return -1;

    for(let i=0; i<list.length; i++) {

        if(list[i].name === card.name){

            if(list[i].set === card.set
                && list[i].collector_number === card.collector_number){

                //Do update
                list[i].foil  = card.foil;
                list[i].count = card.count;

                return i;
            }

            //Stop if we found card by name but wrong set and number.
            return -1;
        }
    }

    return -1;
}

/** Check Cache for Missing Image Information
 * 
 * Checks the cache for any items that are missing images and
 * returns them.
 * 
 * @param {any} cache
 * @returns {Array<any>}
 */
export function checkCacheForMissingInformation(cache){
    let missing = [];

    cache.commanders.forEach(card=>{
        if( typeof card.image_uris === "undefined" || typeof card.color_identity === "undefined"
                || typeof card.art === "undefined") {
            missing.push(card);
        }
    });

    for(let category in cache.mainDeck){
        cache.mainDeck[category].forEach(card=>{
            if(typeof card.image_uris === "undefined") {
                missing.push(card);
            }
        });
    }

    return missing;
}



/** Gets art image from the first commander card.
 * 
 * @param {any} cache
 * @returns {String|undefined}
 */
export function getImage(cache){

    if(cache.commanders.length === 0)
        return undefined;

    return cache.commanders[0].art;
}

/** Get colors of commander cards.
 * 
 * @param {any} cache
 * @returns {String}
 */
export function getColors(cache){
    let colors = new Set();

    cache.commanders.forEach(card=>{
        colorsOfCard(card).forEach(color=>colors.add(color));
    });

    //Mark Colorless if no colors
    if(colors.size === 0)
        return "C";
    
    let output = "";
    colors.forEach(string=>output+=string);

    return output;
}