let storedraids = {"Allance":"start", "Horde":"start"}
let raidLeaderBoardsApiEndpointAlliance = "https://us.api.blizzard.com/data/wow/leaderboard/hall-of-fame/nyalotha-the-waking-city/alliance?namespace=dynamic-us&locale=en_US";
let raidLeaderBoardsApiEndpointHorde = "https://us.api.blizzard.com/data/wow/leaderboard/hall-of-fame/nyalotha-the-waking-city/horde?namespace=dynamic-us";
let raidList = document.querySelector("#raidList");
let factions = ["Allance", "Horde"];

fetch(raidLeaderBoardsApiEndpointHorde + token)
.then ( response => {return response.json()} )
.then ( (leaderBoards) => {
    // This goes through each different leader board
    storedraids["Horde"] = leaderBoards;
});


fetch(raidLeaderBoardsApiEndpointAlliance + token)
.then ( response => {return response.json()} )
.then ( (leaderBoards) => {
    // This goes through each different leader board
    storedraids["Allance"] = leaderBoards;
});


for(let faction of factions)
{
    let newTab = document.createElement('button');
    newTab.classList = "mdc-tab";
    newTab.setAttribute("aria-selected" ,"false");
    newTab.setAttribute("tabindex" ,"-1");
    newTab.setAttribute("role" ,"tab");
    newTab.id = faction.toLowerCase();

    let newTabContent = document.createElement('span'); 
    newTabContent.classList = "mdc-tab__content";

    let newTabTitle = document.createElement('span'); 
    newTabTitle.classList = "mdc-tab__text-label";
    newTabTitle.textContent = faction;

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

    raidList.appendChild(newTab);
}


let raidListInfoExist = setInterval(()=>
{
   if (storedraids["Allance"] != "start") {
      clearInterval(raidListInfoExist);
      createNewCarAlliance();
   }
}, 1000);

let createNewCarAlliance = ()=>
{
    let statingTab = document.querySelector("#" + factions[0].toLowerCase());
    statingTab.setAttribute("aria-selected" ,"true");
    statingTab.setAttribute("tabindex" ,"0");
    statingTab.classList = "mdc-tab mdc-tab--active";
    statingTab.querySelector(".mdc-tab-indicator").classList = "mdc-tab-indicator mdc-tab-indicator--active";
    statingTab.querySelector(".mdc-tab__ripple").classList = "mdc-tab__ripple mdc-ripple-upgraded";
    
    for(let guildinfo of storedraids["Allance"].entries)
    {
        // This is used to get all of the dungon information needed to be used for the display
        let ranking =  guildinfo.rank;
        let guild =  guildinfo.guild.name;
        let faction = guildinfo.faction.type;
        let realmName = guildinfo.guild.realm.slug;
        
        // This creates the outer card
        let newCard = document.createElement('div');
        newCard.classList = "mdc-card";

        // This creates the inner containers
        let cardTop = document.createElement('div');
        cardTop.classList = "mdc-card-wrapper__text-section";
        let cardBottom = document.createElement('div');
        cardBottom.classList = "mdc-card__actions";

        // This creates the top contents of the card
        let cardTitle = document.createElement('div');
        cardTitle.classList = "fation-Text";
        let cardText = document.createElement('div');
        cardText.classList = "info-Text";

        // fills out the text in the top elements
        cardTitle.textContent = "Rank: " + ranking + " " + faction + " (" + realmName.replace(/\w\S*/g, (txt) => {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) + ")";
        cardText.textContent = guild;


        // This stores the elements into the right parent nodes to be displayed
        cardTop.appendChild(cardTitle);
        cardTop.appendChild(cardText);
        newCard.appendChild(cardTop);
        newCard.appendChild(cardBottom);
        raidLeaderBoard.appendChild(newCard);
    }
}