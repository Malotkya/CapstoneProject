/** My Decks (All)
 * 
 * @author Alex Malotky
 */
import wixLocation from 'wix-location';
import wixData from 'wix-data';

const MAX_DESCRIPTION_SIZE = 90; //Characters
const MAX_TITLE_SIZE = 35; //Characters

/** List Repeater Deck Container Click Event
 *  
 * @param {$w.MouseEvent} event
 */
export function DeckContainer_click(event) {
	let $Container = $w.at(event.context);
	wixLocation.to($Container("#btnViewDeck").link); 
}

/** List Repeater Ready Event
 * 
 * Used to shorten large text to apropiate size.
 * 
 * @param {$w.$w} $item
 */
export function listRepeater_itemReady($item) {
	let description = $item("#txtDescription");
	let title = $item("#txtTitle");

	if(description.text.length > MAX_DESCRIPTION_SIZE)
		description.text = description.text.substring(0, MAX_DESCRIPTION_SIZE) + "...";

	if(title.text.length > MAX_TITLE_SIZE)
		title.text = title.text.substring(0, MAX_TITLE_SIZE) + "...";

}

/** Text Names Mouse In Event
 * 
 *  Show Tool Tip Text
 * 
 *	@param {$w.MouseEvent} event
 */
export function txtNames_mouseIn(event) {
	$w("#txtNameToolTip").show();
}

/** Texte Names Mouse Out Event
 * 
 * Hide Tool Tip Text
 * 
 * @param {$w.MouseEvent} event
 */
export function txtNames_mouseOut(event) {
	$w("#txtNameToolTip").hide();
}

/** Check Box Colorless Click Event
 * 
 *	@param {$w.MouseEvent} event
 */
export function chbColorless_click(event) {
	if(event.target.checked){
		$w("#chbWhite").checked = false;
		$w("#chbBlue").checked = false;
		$w("#chbBlack").checked = false;
		$w("#chbRed").checked = false;
		$w("#chbGreen").checked = false;
	}

}

/** Check Box White Click Event
 * 
 *	@param {$w.MouseEvent} event
 */
export function chbWhite_click(event) {
	if(event.target.checked){
		$w("#chbColorless").checked = false;
	}
}

/** Check Box Blue Click Event
 * 
 *	@param {$w.MouseEvent} event
 */
export function chbBlue_click(event) {
	if(event.target.checked){
		$w("#chbColorless").checked = false;
	}
}

/** Check Box Blue Click Event
 * 
 *	@param {$w.MouseEvent} event
 */
export function chbBlack_click(event) {
	if(event.target.checked){
		$w("#chbColorless").checked = false;
	}
}

/** Check Box Red Click Event
 * 
 *	@param {$w.MouseEvent} event
 */
export function chbRed_click(event) {
	if(event.target.checked){
		$w("#chbColorless").checked = false;
	} 
}

/** Check Box Green Click Event
 * 
 *	@param {$w.MouseEvent} event
 */
export function chbGreen_click(event) {
	if(event.target.checked){
		$w("#chbColorless").checked = false;
	}
}

/** Text Names Key Press Event
 * 
 * Performs Search if Enter is Pressed.
 * 
 * @param {$w.KeyboardEvent} event
 */
export function txtNames_keyPress(event) {
	if(event.key === "Enter")
		performSearch();
}

/** Button Submit Click Event
 * 
 *	 @param {$w.MouseEvent} event
 */
export function btnSubmit_click(event) {
	performSearch();
}

/** Button Reset Click Event
 * 
 * @param {$w.MouseEvent} event
 */
export function btnReset_click(event) {
	$w("#txtNames").value = "";
	$w("#chbWhite").checked = false;
	$w("#chbBlue").checked = false;
	$w("#chbBlack").checked = false;
	$w("#chbRed").checked = false;
	$w("#chbGreen").checked = false;
	$w("#chbColorless").checked = false;

	$w("#txtEmptyResults").hide();

	$w('#dynamicDataset').setFilter(wixData.filter());
	$w("#dynamicDataset").loadPage(0);
}

/** End Of Results Viewport Enter Event
 * 
 * Used for infinate scroll style pagenation.
 * 
 * @param {$w.Event} event
 */
export function sctLoadMore_viewportEnter(event) {
	$w("#imgLoading").show();
	$w('#dynamicDataset').loadMore()
		.then(()=>{
			$w("#imgLoading").hide();
		});
}

/** Togggle Input
 * 	
 * Will toggle if the form can be used or not, and will also display a waiting image.
 */
export function toggleInput(){

	if($w("#btnSubmit").enabled){
		$w("#btnSubmit").disable();
		$w("#chbWhite").disable();
		$w("#chbBlue").disable();
		$w("#chbBlack").disable();
		$w("#chbRed").disable();
		$w("#chbGreen").disable();
		$w("#chbColorless").disable();
		$w("#dpnExclusive").disable();
		$w("#txtNames").disable();
		$w("#btnReset").disable();

		$w("#imgWorking").show();
	} else {
		$w("#btnSubmit").enable();
		$w("#chbWhite").enable();
		$w("#chbBlue").enable();
		$w("#chbBlack").enable();
		$w("#chbRed").enable();
		$w("#chbGreen").enable();
		$w("#chbColorless").enable();
		$w("#dpnExclusive").enable();
		$w("#txtNames").enable();
		$w("#btnReset").enable();

		$w("#imgWorking").hide();
	}
}

/** Perform Search
 * 
 * Performs the search against the database based on the user inputs.
 * 
 */
function performSearch(){
	toggleInput();

	let filter = wixData.filter();

	$w("#txtNames").value.split(",").forEach(token=>{
		let name = token.trim();
		if(name.length > 0){
			filter = filter.contains("deckList", name);
		}
	});

	
	if($w("#chbColorless").checked){
		filter = filter.contains("colors", "C");
	} else {
		let exclusive = $w("#dpnExclusive").value === "true";

		if($w('#chbWhite').checked) {
			filter = filter.contains("colors", "W");
		} else if(exclusive){
			filter = filter.not(wixData.filter().contains("colors", "W"));
		}

		if($w('#chbBlue').checked) {
			filter = filter.contains("colors", "U");
		} else if(exclusive){
			filter = filter.not(wixData.filter().contains("colors", "U"));
		}

		if($w('#chbBlack').checked) {
			filter = filter.contains("colors", "B");
		} else if(exclusive){
			filter = filter.not(wixData.filter().contains("colors", "B"));
		}

		if($w('#chbRed').checked) {
			filter = filter.contains("colors", "R");
		} else if(exclusive){
			filter = filter.not(wixData.filter().contains("colors", "R"));
		}

		if($w('#chbGreen').checked) {
			filter = filter.contains("colors", "G");
		} else if(exclusive){
			filter = filter.not(wixData.filter().contains("colors", "G"));
		}
	}

	$w("#dynamicDataset").setFilter(filter)
		.then(()=>{
			if($w("#listRepeater").data.length === 0){
				$w("#txtEmptyResults").show();
			} else {
				$w("#txtEmptyResults").hide();
			}
			
			toggleInput();
		});
}
