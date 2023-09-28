/** Purchase Button Element
 * 
 * @author Alex Malotky
 */
import {Style} from '../PurchaseButton/PurchaseButton-Style';
import {createDesign} from '../PurchaseButton/PurchaseButton-Design';

/** Purchase Button Custome Element
 * 
 * Is actually a form with hidden elements with a stylized submit button.
 */
class PurchaseButton extends HTMLElement {

    /** Default Constructor
     * 
     */
    constructor() {
        super();
        this.innerHTML = createDesign(Style);
        this._list = this.querySelector("#deckList");
    }

    /** Attributes recognized by element
     * 
     */
    static get observedAttributes() {
        return ['list', 'promo'];
    }

    /** Attribute Callback
     * 
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if(name === "list") {
            this.list = newValue;
        } else if(name === "promo") {
            this.promo = newValue;
        }
	}

    /** List Setter
     * 
     * @param {String} value
     */
    set list(value){
        this._list.value = value;
    }

    /** Promo Setter
     * 
     * @param {String} value
     */
    set promo(value) {
        let temp = this._list.value;
        this.innerHTML = createDesign(Style, JSON.parse(value));
        this._list = this.querySelector("#deckList");
        this._list.value = temp;
    }

    /** Ready Callback
     * 
     * Used for event listeners.
     * 
     */
    connectedCallback(){
        //Creates hover effect for promo reminder.
        const text = this.querySelector(".purchase-tooltip-text");
        if(text){
            this.addEventListener("mousemove", event=>{
            
                let posX = Number(event.clientX) + 10;
                let posY = Number(event.clientY);

                text.style.left = posX + "px";
                text.style.top = posY + "px";
            });
        }

        //Copy promo code to clipboard
        const code = this.querySelector("#code");
        if(code){
            this.querySelector("form").addEventListener("submit", event=>{
                code.select();
                document.execCommand('copy');
                alert(`Code: '${code.textContent}' added to clipboard.`);
            });
        }
    }

}

customElements.define('purchase-button', PurchaseButton);