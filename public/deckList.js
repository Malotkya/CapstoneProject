/** Public Deck List File
 * 
 * This file contains all functions related to card objects
 * that will be used on the front end.
 * 
 * @author Alex Malotky
 */

/** Convert Card To String
 * 
 * Used by Download and Purchase buttons.
 * 
 * @param {Object} card
 */
export function convertCardToString(card){
    return card.count + " " + card.name.replace(/\s+/, " ");
}

/** Count Cards in List
 * 
 * @param {Array<Object>} list
 */
export function countCardsInList(list){
    let count = 0;

    list.forEach(card=>{
        let buffer = Number(card.count);

        if(isNaN(buffer)){
            count++;
        } else {
            count += buffer;
        }
        
    });

    return count;
}
