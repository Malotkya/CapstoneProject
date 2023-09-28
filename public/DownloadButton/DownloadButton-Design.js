/** Download Button Design
 * 
 * HTML code of form for purchase button.
 * 
 * @author Alex Malotky
 * @param {String} css
 */
export function createDesign(css){
    return `
        <style>
            ${css}
        </style>
        <a class="download-button">
            <span>Download List</span>
        </a>
    `;
}