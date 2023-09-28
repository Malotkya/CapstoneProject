/** Deck List File
 * 
 * This file contains all the functions related to reading in deck lists,
 * formatting decklists.  Or operations on card objects in the deck lists.
 * 
 * @author Alex Malotky
 */

import {parse} from 'csv-parse/sync';

//Possible commander category spellings.
const POSSIBLE_COMMANDERS = [
    "COMMANDER",
    "COMMANDERS"
];

//Used as Catagories in cache
//If adding a new catagory, make sure to add it to Public/custom-elements/deck-view-element.
const CARD_TYPE_PRIORITY = [
    "Creature",
    "Enchantment",
    "Artifact",
    "Planeswalker",
    "Instant",
    "Sorcery",
    "Land",
    "Battle",
    "Tribal",
    "Unknown"
];

/** Is Commander Card
 * 
 * Determins if the section of a card is commander or not based on a possible
 * spellings of the commander catagory.
 * 
 * @param {Object} card 
 * @returns {Boolean} if is commander
 */
export function isCommanderCard(card){
    if(typeof card.section === "undefined")
        return false;

    for(let i=0; i<POSSIBLE_COMMANDERS.length; i++){
        if(card.section.toUpperCase() === POSSIBLE_COMMANDERS[i]) {
            return true;
        }
    }

    return false;
}


/** Get Card Type from Type Line
 * 
 * Determins the card type catagory from the card type line.
 * 
 * @param {String} typeLine
 * @return {String} Card Type
 */
export function getTypeFromLine(typeLine){
    if(typeof typeLine === "string"){
        for(let i=0; i<CARD_TYPE_PRIORITY.length; i++){
            if(typeLine.indexOf(CARD_TYPE_PRIORITY[i]) >= 0) {
                return CARD_TYPE_PRIORITY[i];
            }
        }
    }
    
    return "Unknown";
}

/** Count Card CMV
 * 
 * Detects and counts cards mana value used for sorting
 * 
 * @param {Object} card
 * @return {Number} count
 */
function countCMV(card){

    //Put all unknowns at end of the list.
    if(typeof card.mana_cost === "undefined"){
        return Number.MAX_VALUE;
    }

    let count = 0;

    card.mana_cost.split(/}*{*/gm).forEach(token=>{
        let buffer = Number(token);
        if(isNaN(buffer)){
            count += 1;
        } else {
            count += buffer;
        }
    });

    return count;
}

/** Get Colors of Card
 * 
 * @param {Object} card
 * @return {Array<String>}
 */
export function colorsOfCard(card){
    if(card.color_identity){
        return card.color_identity;
    }

    return [];
}

/** Sort Cards By CMV Callback
 * 
 * Used by array.sort
 * 
 * @param {Object} a
 * @param {Object} b
 * @return {Number} comparator value
 */
export function sortListByCMV(a, b){
    let lhs = countCMV(a);
    let rhs = countCMV(b);

    if(lhs === rhs){
        return a.name.localeCompare(b.name);
    } else {
        return lhs - rhs;
    }
}

/** Sort Commander List Callback
 * 
 * Used by array.sort
 * 
 * Order is by type: Creature/Plainswalker, Enchantment, Instant/Sorcery, Other
 *                   If the same type order alphabetically.
 * 
 * @param {Object} a
 * @param {Object} b
 * @return {Number} comparator value
 */
export function sortCommanderList(a, b){
    /** Convert Type String to Number
     * 
     * @param {String} string
     * @return {Number}
     */
    const typePriority = string => {
        switch (string){
            case "Creature":
            case "Planeswalker":
                return 0;

            case "Enchantment":
                return 1;

            case "Instant":
            case "Sorcery":
                return 2;

            default:
                return 3;
        }
    };

    let lhs = typePriority(getTypeFromLine(a.type_line));
    let rhs = typePriority(getTypeFromLine(b.type_line));

    if(lhs === rhs){
        return a.name.localeCompare(b.name);
    } else {
        return lhs - rhs;
    }
}

/** Parse Deck List
 * 
 * This function will attempt to parse the decklist of either JSON, CSV, or TXT format.
 * 
 * If in JSON format, the function will asume the data is from the scryfall export function.
 * 
 * If in CSV format, the function will asume the data is from the scryfall export function.
 * 
 * If in TXT format, the funciton will atempt to read the card names line by line in the following format:
 * 
 * @param {String} deckData
 * @returns {Array} Deck List
 */
export function parseDeckList(deckData) {
    let data;
    
    try {
        data =  readJsonData(deckData);
    } catch (e) {
        try {
            data = readCsvData(deckData);
            if(typeof data[0].name === "undefined")
                throw new Error("CSV Failed!");
        } catch (e) {
            try {
                data = readTextData(deckData);
            } catch (e) {
                throw new Error("Unknown Decklist Format: " + e.message);
            }
            
        }
    }

    return data;
}

/** Read in Json Data
 * 
 * Attempts to read in Json data and assumes information is from scryfall.
 * 
 * @param {String} string 
 * @returns {Array} Deck List
 */
function readJsonData(string){
    let data = JSON.parse(string).entries;
    let array = [];
    for(let section in data){
        data[section].forEach(card=>{
            card.section = section;
            
            if(card.card_digest !== null){
                card.name = card.card_digest.name;
                card.mana_cost = card.card_digest.mana_cost;
                card.type_line = card.card_digest.type_line;
                card.set = card.card_digest.set;
                card.collector_number = card.card_digest.collector_number;
                card.image_uris = card.card_digest.image_uris;

                delete card.card_digest;
                array.push(card);
            }
        })
    }

    return array;
}

/** Read in Csv Data
 * 
 * Attempts to read in Csv data and assumes information is from scryfall.
 * 
 * @param {String} string
 * @returns {Array} Deck List
 */
function readCsvData(string){
    let array = parse(string, {
        columns: true
    });

    array.forEach(card=>{
        card.set = card.set_code;
        card.type_line = card.type;

        delete card.set_code;
        delete card.type;
    });

    return array;
}

/** Read in Txt Data
 * 
 * Attempts to read in Text Data.
 * 
 * @param {String} string
 * @returns {Array} Deck List
 */
export function readTextData(string){
    let lines = string.split("\n");
    let array = [];

    if(lines.length == 0){
        throw new Error("Zero lines found.");
    }

    let section = "main deck"
    lines.forEach(line=>{
        line = line.trim();

        if(line.length > 0){ //Skip empty lines

            let sectionTest = line.match(/^\s*\/\//gm);
            if(sectionTest != null) {
                let index = line.indexOf("//");
                section = line.substring(index + 2).trim();

            } else {
                let card = createCardFromString(line);
                card.section = section;
                array.push(card);
            }
        }
        
    })

    return array;
}

/** Create Card From String
 * 
 * Takes a single line and attempts to create a card from it.
 * Assums the Following Format.
 * 
 * ## Card Name [set] F
 * 
 * Where:        ## - is the number of card in the deck (optional)
 *        Card Name - name of the card
 *              set - is the set code in brackets (optional)
 *                F - the card is foil (optional)
 * 
 * @param {String} string
 * @returns {Object} Card
 */
export function createCardFromString(string){
    //get count from string
    let buffer = string.match(/^\d*[Xx]?/gm);
    let count = buffer[0];

    //get set name and foil from string
    buffer = string.match(/(\[.*?\])?\s*[Ff]?$/gm);
    let set = buffer[0];
    let setLength = set.length;

    // Get if foil
    let foil = false;
    if(set){
        let foilTest = set.toUpperCase().lastIndexOf("F");
        if(foilTest >= 4){
            foil = true;
            set = set.substring(0, foilTest).trim();
        }
    }
    

    // Get cardname from string
    let cardName = "";
    if(count === ""){
        count = "1";
        cardName = string;
    } else {
        cardName = string.substring(count.length);
    }

    //Get possible collector number
    let number = undefined;
    if(setLength !== 0) {

        //Remove set information from cardName
        let newLength = cardName.length - setLength;
        cardName = cardName.substring(0, newLength);

        //Remove brackets from setname
        set = set.substring(1, set.length-2);

        
        let collector = set.indexOf(":");
        if(collector > -1){
            if(collector != 3)
                throw new Error("Unknown set code: " + set);

            number = set.substring(4);
            set = set.substring(0, 3);
        }
    }

    //Remove possible x from count
    if(count.toUpperCase().indexOf("X") > -1){
        count = count.substring(0, count.length-1);
    }

    return {
        count: Number(count),
        set: set.trim(),
        name: cardName.trim(),
        foil: foil,
        collector_number: number
    };
}

/** Convert Card to String
 * 
 * @param {any} card
 * @returns {String}
 */
function convertCardToString(card){
    let output = card.count + " " + card.name;

    if(typeof card.set === "string"){
        if(card.set.length > 0){
            output += " [" + card.set;
            
            if(typeof card.collector_number === "string") {
                output += ":" + card.collector_number;
            }

            output += "]";
        }
    }

    if(card.foil){
        output += " F";
    }

    return output + "\n";
}

/** Make New Deck List
 * 
 * Takes the cache and makes a new deck list that is easy to read and eddit.
 * 
 * @param {any} cache
 * @returns {String}
 */
export function newDeckList(cache){
    let output = "";
    if(cache.commanders.length > 0)
        output += "//Commander\n";

    cache.commanders.forEach(card=>{
        output += convertCardToString(card);
    });

    for(let catagory in cache.mainDeck){

        if(cache.mainDeck[catagory].length === 0){
            delete cache.mainDeck[catagory];
        } else {
            output += `\n//${catagory}\n`;

            cache.mainDeck[catagory].forEach(card=>{
                output += convertCardToString(card);
            });
        }
    }

    return output;
}