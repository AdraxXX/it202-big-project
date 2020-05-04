let storedKeystones = {};
let createKeystoneLeaderboards = () =>
{
    let dungonList = document.querySelector("#dungonsList");
    for(let listRealms of RealmInfo )
    {
        // This let us fetch the mythic keystone information from the leaderboards
        let mythicLeadersURL = listRealms.mythic_leaderboards.href;
        fetch(mythicLeadersURL + token)
        .then ( response => {return response.json()} )
        .then ( (leaderBoards) => {
            // This goes through each different leader board
            for(let leaderBoard of leaderBoards.current_leaderboards)
            {
                let leaderBoardURL = leaderBoard.key.href;
                fetch(leaderBoardURL + token)
                .then ( response => {return response.json()} )
                .then ( (dungLeaderBoard) => {
                    // This is used to get all of the dungon information needed to be used for the display
                    let seconds = Math. trunc(((dungLeaderBoard.leading_groups[0].duration/60000) * 100) % 100 / 100 * 60);
                    let mins = Math. trunc((dungLeaderBoard.leading_groups[0].duration/60000));
                    let keystoneLevel = dungLeaderBoard.leading_groups[0].keystone_level;
                    let ranking =  dungLeaderBoard.leading_groups[0].ranking;
                    let group = dungLeaderBoard.leading_groups[0].members;
                    let faction = group[0].faction.type;
                    
                    // This creates the outer card
                    let newCard = document.createElement('div');
                    newCard.classList = "mdc-card";

                    // This creates the inner containers
                    let cardTop = document.createElement('div');
                    cardTop.classList = "mdc-card-wrapper__text-section";
                    let cardBottom = document.createElement('div');
                    cardBottom.classList = "mdc-card__actions";

                    // This creates the top contents of the card
                    let cardPicture = document.createElement('div');
                    cardPicture.classList = "mdc-card__media mdc-card__media--16-9 cardImage float-Left";
                    let cardTitle = document.createElement('div');
                    cardTitle.classList = "fation-Text";
                    let cardText = document.createElement('div');
                    cardText.classList = "info-Text";

                    // Creates the text from the data
                    let text = "Keystone Level: " + keystoneLevel + " Time: " + mins + " mins " + seconds + " seconds";

                    // fills out the text in the top elements
                    cardTitle.textContent = faction;
                    cardText.textContent = text;

                    // This is used to get the name of the image for the dungon
                    let imgNameReal = "";
                    imgNameReal = dungLeaderBoard.name.en_US.replace(/ /g, "");
                    imgNameReal = imgNameReal.replace(/'/g, "");
                    imgNameReal = imgNameReal.replace(/:/g, "");
                    imgNameReal = imgNameReal.replace(/!/g, "");
                    imgNameReal = imgNameReal.replace(/-/g, "");
                    // This will create the tab bar for the users to check different dungons
                    if(dungonList.querySelector('#' + imgNameReal) == null)
                    {
                        let newTab = document.createElement('button');
                        newTab.classList = "mdc-tab";
                        newTab.setAttribute("aria-selected" ,"false");
                        newTab.setAttribute("tabindex" ,"-1");
                        newTab.setAttribute("role" ,"tab");
                        newTab.id = imgNameReal;
                        
                        let newTabContent = document.createElement('span'); 
                        newTabContent.classList = "mdc-tab__content";
                        
                        let newTabTitle = document.createElement('span'); 
                        newTabTitle.classList = "mdc-tab__text-label";
                        newTabTitle.textContent = dungLeaderBoard.name.en_US;
                        
                        newTabContent.appendChild(newTabTitle);
                        
                        let newTabIndicator = document.createElement('span'); 
                        newTabIndicator.classList = "mdc-tab-indicator";
                        
                        let newTabIndicatorSpan = document.createElement('span'); 
                        newTabIndicatorSpan.classList = "mdc-tab-indicator__content mdc-tab-indicator__content--underline";
                        
                        newTabIndicator.appendChild(newTabIndicatorSpan);
                        
                        let newTabEnd = document.createElement('span'); 
                        newTabEnd.classList = "mdc-tab__ripple mdc-ripple-upgraded";
                        newTabEnd.style="--mdc-ripple-fg-size:93px; --mdc-ripple-fg-scale:1.85613; --mdc-ripple-fg-translate-start:46.6875px, -22.5px; --mdc-ripple-fg-translate-end:31.1875px, -22.5px;";
                        
                        newTab.appendChild(newTabContent);
                        newTab.appendChild(newTabIndicator);
                        newTab.appendChild(newTabEnd);
                        
                        dungonList.appendChild(newTab);
                    }
                    
                    if(storedKeystones[dungLeaderBoard.name.en_US] == null)
                        storedKeystones[dungLeaderBoard.name.en_US] = [];
                    
                    // This makes that image the background to the card picture area
                    cardPicture.style = "background:url('" + "img/" + imgNameReal + ".png" + "');";

                    for(let player in group)
                    {
                        // This creates the bottom contents of the card one item at a time 
                        let cardButton = document.createElement('button');
                        cardButton.classList = "mdc-button mdc-card__action mdc-card__action--button mdc-ripple-upgraded";
                        let cardSpan =   document.createElement('span');
                        cardSpan.classList = "mdc-button__label";
                        let cardRipple =   document.createElement('div');
                        cardRipple.classList = "mdc-button__ripple";

                        // This gets the list of players names
                        let playerProfile = group[player].profile;
                        cardSpan.textContent = playerProfile.name + "(" + playerProfile.realm.slug + ")";

                        // This stores the elements into the right parent node to be displayed
                        cardButton.appendChild(cardSpan);
                        cardButton.appendChild(cardRipple);
                        cardBottom.appendChild(cardButton);
                    }

                    // This stores the elements into the right parent nodes to be displayed
                    cardTop.appendChild(cardPicture);
                    cardTop.appendChild(cardTitle);
                    cardTop.appendChild(cardText);
                    newCard.appendChild(cardTop);
                    newCard.appendChild(cardBottom);
                    storedKeystones[dungLeaderBoard.name.en_US].push({"level" : keystoneLevel, "min" : mins, "seconds" : seconds, "card" : newCard, "slugName" : imgNameReal, "rank" : 120});
                });
            }
        });
    }
    include('js/actionEvents.js'); 
};


    