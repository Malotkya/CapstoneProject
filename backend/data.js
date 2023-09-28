/***************
 backend/data.js
 ***************

 'backend/data.js' is a reserved Velo file that enables you to create data hooks.

 A data hook is an event handler (function) that runs code before or after interactions with your site's database collections. 
 For example, you may want to intercept an item before it is added to your collection to tweak the data or to perform a final validation.

 Syntax for functions:

  export function [collection name]_[action](item, context){}

 Example: 

  export function myCollection_beforeInsert(item, context){}

 ---
 More about Data Hooks: 
 https://support.wix.com/en/article/velo-about-data-hooks

 Using Data Hooks: 
 https://support.wix.com/en/article/velo-using-data-hooks

 API Reference: 
 https://www.wix.com/velo/reference/wix-data/hooks

***************/
import {parseDeckList, newDeckList, sortListByCMV, sortCommanderList} from 'backend/deckList.js';
import {searchScryfalFromList} from "backend/scryfall.js";
import {importCache, updateCache, checkCacheForMissingInformation, insertIntoCache, getImage, getColors} from "backend/cache.js";
import wixData from 'wix-data';

/** Update Cache From Deck List
 * 
 * Uses infromation entered from the deck list column and updates or creates the cache column.
 * 
 * @param {any} item
 * @return {Promise<any>}
 * @author Alex Malotky
 */
export async function updateCacheFromDeckList(item){
    let deckList = parseDeckList(item.deckList);
    let cache = importCache(item.cache);

    updateCache(cache, deckList);

    item.cache = JSON.stringify(cache);

    return item;
}

/** Check Scryfall From Cache
 * 
 * Gets card information from scryfall for any missing information in the cache.
 * 
 * @param {any} item
 * @return {Promise<any>}
 * @author Alex Malotky
 */
export async function checkScryfallFromCache(item){
    let cache = importCache(item.cache);
    let missing = checkCacheForMissingInformation(cache);

    let updates = await searchScryfalFromList(missing);
    insertIntoCache(cache, updates);

    //quick sort on update
    cache.commanders = cache.commanders.sort(sortCommanderList);
    for(let catagory in cache.mainDeck)
        cache.mainDeck[catagory] = cache.mainDeck[catagory].sort(sortListByCMV);

    //Update Image
    if(typeof item.image === "string"){

        //Make sure image isn't uploaded to wix
        if( item.image.indexOf("wix:image:") !== -1) {
            item.image = getImage(cache);
        }

    }  else {
        item.image = getImage(cache);
    }

    //Update Colors
    item.colors = getColors(cache);

    //Update DeckList
    item.deckList = newDeckList(cache);

    //Update Cache
    item.cache = JSON.stringify(cache);

    return item;
}

/** My Decks Before Update Hook
 *
 */
export async function MyDecks_beforeUpdate(item, context) {
    item = await updateCacheFromDeckList(item);
    return await checkScryfallFromCache(item);
}

/** My Decks Before Insert Hook
 * 
 */
export async function MyDecks_beforeInsert(item, context) {
    return await updateCacheFromDeckList(item);
}

/** My Decks After Insert Hook
 * 
 */
export function MyDecks_afterInsert(item, context) {
	wixData.update(context.collectionName, item);
    return item;
}