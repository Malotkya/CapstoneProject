/** Purchase Button Design
 * 
 * HTML code of form for purchase button.
 * 
 * @author Alex Malotky
 */
import {FORM_URI, BUTTON_VALUE, LIST_NAME, GAME_NAME, GAME_VALUE, FORMAT_NAME, FORMAT_VALUE} from './PurchaseButton-Constants';

/**Create HTML code
 * 
 * @param {String} css
 * @param {any} promotion
 */
export function createDesign(css, promotion){
    //Physical button
    const button = `<input type='submit' value='${BUTTON_VALUE}' class='purchase-button'>`;

    let html = `
        <style>
            ${css}
        </style>
        <form method='POST' action='${FORM_URI}' target="_blank" class="purchase-form">
            <input type='hidden' name='${LIST_NAME}' id='deckList'>
            <input type="hidden" name="${FORMAT_NAME}" value="${FORMAT_VALUE}">
            <input type="hidden" name="${GAME_NAME}" value="${GAME_VALUE}">`;

            //Check for Promo Options.
            if(typeof promotion === "object") {

                //Promo Code to be coppied to clipboard
                if(promotion.code) {
                    html += `<textarea name="sCode" id="code" class="purchase-hidden">${promotion.code}</textarea>`;
                }

                //Promo Tooltip Text
                if(promotion.text) {
                    html += `<div class='purchase-tooltip'>
                        <span class='purchase-tooltip-text'>${promotion.text}</span>
                            ${button}
                    </div>`;
                } else {
                    html += button;
                }
            
            //No Promotion
            } else {
                html += button;
            }
            
    html += `</form>`;

    return html;
}