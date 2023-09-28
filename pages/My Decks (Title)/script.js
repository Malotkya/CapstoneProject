/** My Decks (Title)
 * 
 * @author Alex Malotky
 */
import wixWindow from 'wix-window';
import wixData from 'wix-data';
import {convertCardToString} from 'public/deckList';

$w.onReady(function () {
	const $data = $w("#dynamicDataset");
	const $btnPurchase = $w("#btnPurchase");
	const $btnDownload = $w("#btnDownload");
	const $target = $w("#deckView");
	
	//Get Promotions from the database
	wixData.query("Promotions").find().then(result=>{
		$btnPurchase.setAttribute('promo',
			JSON.stringify({
				code: result.items[0].PURCHASE_CODE,
				text: result.items[0].PURCHASE_BUTTON_HOVER_TEXT
			})
		);
	});

	//Add deck data to elements.
	$data.onReady(function() {
		const data = $data.getCurrentItem();
		const cacheData = JSON.parse(data.cache);

		let rawList = cacheData.commanders.map(convertCardToString);
		for(let attribute in cacheData.mainDeck){
			rawList = rawList.concat(cacheData.mainDeck[attribute].map(convertCardToString));
		}

		$btnPurchase.setAttribute("list", rawList.join("\n"));
		$btnDownload.setAttribute("list", data.deckList);
		$btnDownload.setAttribute("name", data.title);

		$target.setAttribute("formfactor", wixWindow.formFactor);
		$target.setAttribute("list", data.cache);
	});	
});