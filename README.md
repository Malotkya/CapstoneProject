# Capstone Project

## Background
In order to graduate from my [Applied Computing](https://uwex.wisconsin.edu/applied-computing/#overview) program I had to complete a Capstone Project where ideally I would be working with a client (ex. an employeer or local company) and create some kind of project.  Because at the time I worked for a security company I decided to reach out to a Magic the Gathering content creater named DJ about creating a website.   I had seen him complain online that he have been running into issues with displaying the decks online and wished for a custom solution.

## About Magic the Gathering
Magic the Gathering is a card game with a different formats that have varying rules.  Some people just collect the cards, and other people play the game competitivly, while most just play for fun with their friends at home. I personally play a format called Commander or EDH where the decks are based around a single card that helms the deck.  Displaying the decks in this app is prioritized for displaying commander decks.

## Requirements
The main requirements for this project where:
1) Being able to easily add decks that had been created in scryfall.
2) Be able to easily view the cards in the deck without ads or unnecisary information.
3) Being able to easily to view all the decks in a list.

Some stretch goals were added like:
1) Being able to search the decks.
2) A link for downloading the decklists.
3) A link to purchase the decklists.

## Technology
Wix was chosen as the platform to develop the website because it has drag and drop elements that would allow DJ to be able to make changes and maintain the website after I was no longer working on the project.
Wix also came with the abbility to add custom elements allowing me to add special functionality and a document database for storing the deck information.

To Npm packages were added to the project:
1) [cvs-parse](https://www.npmjs.com/package/csv-parse): used for parsing cvs deck information uploaded to the database.
3) [masonry-layout](https://www.npmjs.com/package/masonry-layout): used to form a masonry layout betweeen the different catagories in a deck list.
