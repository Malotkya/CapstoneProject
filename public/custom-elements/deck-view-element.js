/** Deck View Element
 * 
 * @author Alex Malotky
 */
import Masonry from "masonry-layout";
import {createWireFrame, createCategory, createCardListItem, createCommanderListItem} from "../DeckView/DeckView-Design";
import {Styles} from '../DeckView/DeckView-Style';
import {countCardsInList} from "../deckList.js";

//Used to determine the order card categories are written to dom.
//If adding a new catagory, make sure to add it to Backend/deckList.js
const CATEGORY_ORDER = [
    "Creature",
    "Instant",
    "Sorcery",
    "Planeswalker",
    "Artifact",
    "Enchantment",
    "Land",
    "Battle",
    "Tribal",
    "Unknown"
];

/** Deck View Custom Element
 * 
 * This elemnt will be passed a couple of lists containing cards and display them for users to see.
 */
class DeckView extends HTMLElement {
    
    /** Default Constructor
     * 
     * Desfaults to Desktop Css
     */
    constructor() {
        super();
        this.innerHTML = createWireFrame(Styles());
        this._css = this.querySelector("style");
        this._commanders = this.querySelector("#commanders");
        console.debug(this.querySelector("#mainDeck"));
        this._mainDeck = this.querySelector("#mainDeck");
    }

    /** Attributes recognized by element
     * 
     */
    static get observedAttributes() {
        return [ 'formfactor', 'list'];
    }

    /** Attribute Callback
     * 
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if(name === 'formfactor'){
            this.css = newValue;
        } else if(name === 'list') {
            const deckList = JSON.parse(newValue);
            this.commanders = deckList.commanders;
            this.mainDeck = deckList.mainDeck;
            this.createCardEvents();
        }
	}
    
    /** Css Setter/Getter
     * 
     * Chooses css type based on render window.
     * 
     * @param {String} value
     */
    set css(value){
        this._css.innerHTML = Styles(value);
    }
    get css(){
        return this._css;
    }

    /** Commander list Setter/Getter
     * 
     * @param {Array<Card>} value
     */
    set commanders(value) {

        //Check for any commanders
        if(value.length === 0) {
            const remove = this.querySelector("#commanders");
            if(remove)
                this.removeChild(remove);

        } else {

            //Check for multiple
            if(value.length > 1){
                this.querySelector("h2").textContent = "Commanders:";
            }

            //Add to list
            let commanderTarget = this._commanders.querySelector(".commander-list");
            value.forEach(card=>{
                commanderTarget.innerHTML += createCommanderListItem(card);
            });
        }
    }
    get commanders() {
        return this._commanders;
    }

    /** Main Deck list Setter/Getter
     * 
     * @param {Object} value
     */
    set mainDeck(value) {

        //Loop through all catagories
        CATEGORY_ORDER.forEach(category=>{
            const list = value[category]

            if(list){
                this._mainDeck.innerHTML += createCategory(category, countCardsInList(list));

                //Add all cards to list.
                const target = this._mainDeck.querySelector(`.${category}`);
                
                list.forEach(card=>{
                    target.innerHTML += createCardListItem(card);
                });
            }
        });

        //Masonry Layout Magic
        new Masonry(this._mainDeck, {
            itemSelector: '.category',
            columnWidth: '.category-size',
            percentPosition: true
        }).layout();

        this._mainDeck.removeChild(this.querySelector('.category-size'));
    }
    get mainDeck(){
        return this._mainDeck;
    }

    /** Create Card Click Events
     * 
     * These events are needed for iPhones, otherwise cards aren't gaining focus.
     * 
     */
    createCardEvents() {
        this.querySelectorAll(".card").forEach(card=>{
            card.addEventListener("click", event=>{
                card.focus();
            })
        })
    }

}

customElements.define('deck-view-element', DeckView);