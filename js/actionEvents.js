let lastSize = 0;
let sorted = false;
let doneSorted = false;
let tabEventHandling = setInterval(()=>
{
   if (lastSize == storedKeystones["Freehold"].length) 
   {
       
      if(!sorted)
      {
          include('js/sortKeystones.js');
          sorted = true;
      }
       
      if(doneSorted)
      {
          clearInterval(tabEventHandling);
          for(let nodes of storedKeystones["Freehold"])
              
              document.querySelector('#keystoneLeaderBoard').appendChild(nodes.card);
          let startingTab = document.querySelector('#Freehold');
          startingTab.setAttribute("aria-selected" ,"true");
          startingTab.setAttribute("tabindex" ,"0");
          startingTab.classList = "mdc-tab mdc-tab--active";
          startingTab.querySelector(".mdc-tab-indicator").classList = "mdc-tab-indicator mdc-tab-indicator--active";
          startingTab.querySelector(".mdc-tab__ripple").classList = "mdc-tab__ripple mdc-ripple-upgraded";
          let activeBounderies = startingTab.getBoundingClientRect();
          let windowWidth = window.innerWidth;
          let fullElementWidth = activeBounderies.x + activeBounderies.width;
          let changeNeeded = 0;
          if(fullElementWidth > windowWidth)
              changeNeeded = (fullElementWidth - windowWidth) + 40;
          if(fullElementWidth < 0)
              changeNeeded = fullElementWidth - 40;

          startingTab.parentNode.parentNode.parentNode.style.marginLeft = (-1) * changeNeeded + "px";
          for(let tab of document.querySelectorAll(".mdc-tab-scroller button"))
          {
                //console.log(tabs);
                tab.addEventListener('click', ()=>
                {
                    let currentActive = document.querySelector('#' + tab.parentNode.id + ' .mdc-tab--active');
                    currentActive.setAttribute("aria-selected" ,"false");
                    currentActive.setAttribute("tabindex" ,"-1");
                    currentActive.classList = "mdc-tab";
                    currentActive.querySelector(".mdc-tab-indicator").classList = "mdc-tab-indicator";
                    currentActive.querySelector(".mdc-tab__ripple").classList = "mdc-tab__ripple mdc-ripple-upgraded";
                    tab.setAttribute("aria-selected" ,"true");
                    tab.setAttribute("tabindex" ,"0");
                    tab.classList = "mdc-tab mdc-tab--active";
                    tab.querySelector(".mdc-tab-indicator").classList = "mdc-tab-indicator mdc-tab-indicator--active";
                    tab.querySelector(".mdc-tab__ripple").classList = "mdc-tab__ripple mdc-ripple-upgraded";

                    let activeBounderies = tab.getBoundingClientRect();
                    let windowWidth = window.innerWidth;
                    let changeNeeded = 0;
                    if(activeBounderies.right > windowWidth)
                        changeNeeded = (activeBounderies.right - windowWidth) + 40;
                    if(activeBounderies.left < 0)
                        changeNeeded = activeBounderies.left - 40;
                    let currentMarginLeft = tab.parentNode.parentNode.parentNode.style.marginLeft;
                    tab.parentNode.parentNode.parentNode.style.marginLeft = parseInt(currentMarginLeft.replace(/px/g, "")) + ((-1) * changeNeeded ) + "px";
                    // This will allow us to clear out the current top 100 list and make a new one with using the new chosen faction
                    if(tab.parentNode.id == "raidList")
                    {
                        let currentFaction = tab.id.replace(/\w\S*/g, (txt) => {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                        let parentNode = document.querySelector('#raidLeaderBoard').parentNode;

                        document.querySelector('#raidLeaderBoard').remove();
                        let newLeaderBoard = document.createElement('div');
                        newLeaderBoard.id = "raidLeaderBoard";
                        parentNode.appendChild(newLeaderBoard);
                        raidLeaderBoard = document.querySelector("#raidLeaderBoard");

                        for(let guildinfo of storedraids[currentFaction].entries)
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
                    else if(tab.parentNode.id == "dungonsList")
                    {
                        let currentDungon = tab.textContent;
                        let parentNode = document.querySelector('#keystoneLeaderBoard').parentNode;

                        document.querySelector('#keystoneLeaderBoard').remove();
                        let newLeaderBoard = document.createElement('div');
                        newLeaderBoard.id = "keystoneLeaderBoard";
                        for(let keyRuns of storedKeystones[currentDungon])
                        {
                            newLeaderBoard.appendChild(keyRuns.card);
                        }
                        parentNode.appendChild(newLeaderBoard);
                        
                    }
                });
          }
      }
   }
   lastSize = storedKeystones["Freehold"].length;
}, 10000);