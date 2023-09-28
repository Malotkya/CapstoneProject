/** Deck View Design
 * 
 * HTML code of main deck view
 * 
 * @author Alex Malotky
 */


/** Deck View HTML Wire Frame
 * 
 * @param {String} css
 */
export function createWireFrame(css){
    return `
        <style>${css}</style>
        <aside id="commanders">
            <h2>Commander:</h2>
            <ul class="commander-list"></ul>
        </aside>
        <article id="mainDeck">
            <div class="category-size"></div>
        </article>
    `;
}

/** Catagory HTML Code
 * 
 * @param {String} title
 * @param {Number} size
 */
export function createCategory(title, size){
    return `
        <section class="category">
            <h3>${title} (${size}):</h3>
            <ul class="section-list ${title}"></ul>
        </section>
    `;
}

/** Regular Card List Item HTML Code
 * 
 * @param {Object} card
 * @param {String} additional
 */
export function createCardListItem(card, additional){
    let name = card.name;
    let test = name.indexOf("//");
    if(test >= 0){
        let index = test + 2;
        name = name.substring(0, index) + "<br>" + name.substring(index);
    }

    if(typeof additional === "undefined")
        additional = "";

    let html = `
        <li class="card ${additional}">
            <span class="name">${card.count} ${name}</span>
            <span>`;
            

    html += createCardImageFigure(card);      

        
   html += `</span>
        </li>
    `;

    return html;
}

/** Commander Card List Item HTML Code
 * 
 * @param {Object} card
 */
export function createCommanderListItem(card){
    return createCardListItem(card, "commander");
}

/** Card Figure Object
 * 
 * @param {Object} card
 */
function createCardImageFigure(card){
    let html = "";

    if(card.image_uris){
        //Check for more then one card image.
        if(Object.keys(card.image_uris).length > 1) {
            html += `<figure class='double'>`;
        } else {
            html += `<figure>`;
        }

        html += `<div class='figure'>`;
                    
        //Create image for each side
        for(let side in card.image_uris) {
            let source = card.image_uris[side];

            if(typeof source === "string")
                html += `<img src="${source}" alt="${card.name} ${side}">`;
            else
                html += `<strong>Error:</strong><p>${source.errMessage}</p>`;
        }

        html += "</div>"

        //Add Foil Effect Overlay
        if(card.foil){
            html += `<div class='foil'></div>`;
        }

        html += "</figure>";
    } else {
        html = `
            <figure>
                <div class="figure">
                    <p>
                        <strong>Error:</strong>
                    </p>
                    <p>
                        Image was not found.
                    </p>
                </div>
            </figure>
        `;
    }

    return html;
}