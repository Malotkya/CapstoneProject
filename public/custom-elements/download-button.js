/** Download Button Element
 * 
 * @author Alex Malotky 
 */
import {Style} from '../DownloadButton/DownloadButton-Style';
import {createDesign} from '../DownloadButton/DownloadButton-Design';

/** Download Button Custome Element
 * 
 * A link pointing to a file created with javascript.
 * 
 */
class DownloadButton extends HTMLElement {

    /** Default Constructor
     * 
     */
    constructor() {
        super();
        this.innerHTML = createDesign(Style);
        this.button = this.querySelector(".download-button");
        this.button.href = "decklist.txt";
    }

    /** Attributes recognized by element
     * 
     */
    static get observedAttributes() {
        return ['list', 'name'];
    }

    /** Attribute Callback
     * 
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if(name === "list") {
            this.list = newValue;
        } else if(name === "name") {
            this.name = newValue;
        }
	}

    /** List Setter
     * 
     * @param {String} - value 
     */
    set list(value){
        const blob = new Blob([value], {type: 'text/plain'});
        const file = window.URL.createObjectURL(blob);
        this.button.download = file;
    }

    /** List Getter
     * 
     */
    get list() {
        return this.button.download.text();
    }

    /** File Name Setter
     * 
     */
    set name(value){
        this.button.href = value + ".txt";
    }

    /** File Name Getter
     * 
     */
    get name(){
        return this.button.href;
    }
}

customElements.define('download-button', DownloadButton);