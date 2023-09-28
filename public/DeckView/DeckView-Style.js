/** Deck View Css Styles
 * 
 * Css code for different view ports stored in strings.
 * 
 */

/** Main Css
 * 
 * Css code used by all viewports
 */
const MAIN_CSS = `

html, #wix-internal-id {
    overflow-y: scroll;
}

#commanders {
    margin-bottom: 1em;
    font-size: 1.25em;
}

.category {
    margin-bottom: 2em;
}

.name {
    cursor: default;
}

.card figure {
    visibility: hidden;
    margin: 0;
    padding: 0;
    position: absolute;
    top: auto;
    left: auto;
    transform: translateY(-30%);
    z-index: 1;
}

.foil {
    background: linear-gradient(-60deg,purple,blue,green,#ff0,red);
    opacity: .25;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

.card:hover figure, figure:hover, figure:focus{
    visibility: visible;
}

`;

/** Desktop Css
 * 
 * Css code used by desktop viewports
 */
const DESKTOP_CSS = `

/* Desktop View Port */
deck-view-element{
    font-size: 1.5em;
}

.card {
    margin-top: 5px;
    position: relative;
    display: grid;
    grid-template-columns: auto 50%;
}

.commander {
    grid-template-columns: 30% auto;
}

.figure{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
}

.card figure img {
    width: 200px;
}

.commander figure img {
    width: 300px;
}

.category-size,
.category {
    width: 33%;
}

`;

/** Tablet Css
 * 
 * Css code used by desktop viewports
 */
const TABLET_CSS = `

/* Tablet View Port */
.card {
    margin-top: 5px;
    position: relative;
    display: grid;
    grid-template-columns: auto 50%;
}

.commander {
    grid-template-columns: 40% auto;
}

.figure{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
}

.card figure img {
    width: 200px;
}

.card figure.double img{
    width: 100px;
}

.commander figure img {
    width: 300px;
}

.category-size,
.category {
    width: 50%;
}

`;

/** Mobile Css
 * 
 * Css code used by desktop viewports
 */
const MOBILE_CSS = `
/* Mobile View Port */
.card {
    margin-top: 5px;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
}

.card .name {
    width: 55%;
}

.card figure{
    margin-left: 5px;
    width: 40%;
}

.card figure.double img{
    width: 50%;
}

.card figure img {
    width: 100%;
}

.category-size,
.category {
    width: 100%;
}

.foil{
    height: 95%
}
`;

/** Css Styles Function
 *  
 * @param {String} viewport
 */
export function Styles(viewport){
    let css = MAIN_CSS;
    switch(viewport){
    case "Mobile":
	    css += MOBILE_CSS;
	    break;
			
	case "Tablet":
        css += TABLET_CSS;
        break;

	case "Desktop":
	default:
        css += DESKTOP_CSS;
    }

    return css;
}