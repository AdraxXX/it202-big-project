let currentXpack = "Battle for Azeroth";
let currentRaid = "Ny'alotha, the Waking City";
let raidingData = [];
let loadPlayer = () =>
{
    if(document.querySelector('#Player').value != "" && document.querySelector('#Realm').value != "" && document.querySelector('#Region').value != "")
    {
        let realm = SlugName[document.querySelector('#Realm').value];
        let apiEndpointCharacterProfile = "https://us.api.blizzard.com/profile/wow/character/" + realm + "/" + document.querySelector('#Player').value.toLowerCase() + "?namespace=profile-us&locale=en_US";
        let apiEndpointCharacterDungeonEncounter = "https://us.api.blizzard.com/profile/wow/character/" + realm + "/" + document.querySelector('#Player').value.toLowerCase() + "/mythic-keystone-profile/season/4?namespace=profile-us";
        let apiEndPointCharacterRaidEncounters = "https://us.api.blizzard.com/profile/wow/character/" + realm + "/" + document.querySelector('#Player').value.toLowerCase() + "/encounters/raids?namespace=profile-us"
        
        fetch(apiEndpointCharacterDungeonEncounter + token)
        .then ( response => {
            if (!response.ok) 
              throw new Error('Player Not found');
            return response.json();
        })
        .then ( (json) => {
            for(let run of json.best_runs)
            {
                let imgNameReal = "";
                let time = run.duration;
                let keystoneLevel = run.keystone_level;
                let completedInTime = run.is_completed_within_time;
                let data = new Date(run.completed_timestamp);
                imgNameReal = run.dungeon.name.en_US.replace(/ /g, "");
                imgNameReal = imgNameReal.replace(/'/g, "");
                imgNameReal = imgNameReal.replace(/:/g, "");
                imgNameReal = imgNameReal.replace(/!/g, "");
                imgNameReal = imgNameReal.replace(/-/g, "");
                let title = run.dungeon.name.en_US + " " + data;
                let seconds = Math. trunc(((time/60000) * 100) % 100 / 100 * 60);
                let mins = Math. trunc((time/60000));
                let textContent = "Keystone Level: " + keystoneLevel + " (" + mins + " mins " + seconds + " seconds)";
                if(completedInTime)
                    textContent += " Completed In Time";
                
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

                // fills out the text in the top elements
                cardTitle.textContent = title;
                cardText.textContent = textContent;


                // This makes that image the background to the card picture area
                cardPicture.style = "background:url('" + "img/" + imgNameReal + ".png" + "');";

                // This stores the elements into the right parent nodes to be displayed
                cardTop.appendChild(cardPicture);
                cardTop.appendChild(cardTitle);
                cardTop.appendChild(cardText);
                newCard.appendChild(cardTop);
                newCard.appendChild(cardBottom);
                document.querySelector("#playerKeystoneboard").appendChild(newCard);
            }
        })
        .catch(error => {
            if("Error: Player Not found" == error)
            {
                document.querySelector("#alertText").textContent = "Search for " + document.querySelector('#Player').value + " on " + document.querySelector('#Realm').value + " failed.";
                document.querySelector("#alertMessage").style.display = "block";
            }
        });
        
        let playerLevel = 0;
        fetch(apiEndpointCharacterProfile + token)   
        .then ( response => {return response.json()} )
        .then ( (player) => {
            playerLevel = player.level;
            if(playerLevel != 120)
                throw new Error('Player not max level');
            for(let viewScreen of document.querySelector('main').querySelectorAll('.view'))
            {
                if(viewScreen.id == "characterScreen")
                    viewScreen.style.display = "block";
                else
                    viewScreen.style.display = "none";
             }
           })
           .catch(error => {
               console.log(error);
               if("Error: Player not max level" == error)
               {
                   document.querySelector("#alertText").textContent = "Search for " + document.querySelector('#Player').value + " is not max level.";
                   document.querySelector("#alertMessage").style.display = "block";
               }
           });
        
        fetch(apiEndPointCharacterRaidEncounters + token)
        .then ( response => {return response.json()} )
        .then ( (raids) => {
            for(let xpack of raids.expansions)
            {
                if(xpack.expansion.name == currentXpack)
                {
                    for(let raids of xpack.instances)
                    {
                        if(raids.instance.name == currentRaid)
                        {
                            for(let raidmodes of raids.modes)
                            {
                                let difficulty = raidmodes.difficulty.type;
                                for(let encounterInfo of raidmodes.progress.encounters)
                                {
                                    let encounterName = encounterInfo.encounter.name;
                                    let data = new Date(encounterInfo.last_kill_timestamp);
                                    let numberOftime = encounterInfo.completed_count;
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
                                    cardTitle.textContent = encounterName + " (" + difficulty + ")";
                                    cardText.textContent = data;

                                    
                                    cardTop.appendChild(cardTitle);
                                    cardTop.appendChild(cardText);
                                    newCard.appendChild(cardTop);
                                    newCard.appendChild(cardBottom);
                                    document.querySelector("#playerraidboard").appendChild(newCard);
                                    raidingData.push({"encounter" : encounterName + " (" + difficulty + ")", "timesDone" : numberOftime});
                                }
                            }
                        }
                    }
                }
            }
        });

        
        let lastSize = -1;
        let loadTable = setInterval(()=>
        {
           if (lastSize == raidingData.length) 
           {
                              // Load the Visualization API and the corechart package.
              google.charts.load('current', {'packages':['corechart']});

              // Set a callback to run when the Google Visualization API is loaded.
              google.charts.setOnLoadCallback(drawChart);

              // Callback that creates and populates a data table,
              // instantiates the pie chart, passes in the data and
              // draws it.
              function drawChart() 
               {

                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Bosses');
                data.addColumn('number', 'Completed Runs');
                for(let encounterInfo of raidingData)
                {
                    data.addRows([[encounterInfo.encounter, encounterInfo.timesDone]]);
                }

                // Set chart options
                var options = {'title':'Raid Boss Downs',
                               'height':400};

                // Instantiate and draw our chart, passing in some options.
                var chart = new google.visualization.BarChart(document.querySelector('#raid_chart'));
                chart.draw(data, options);
              }
           }
           lastSize = raidingData.length;
        }, 5000);

    }
}


document.querySelector('#playerSearch').addEventListener('click', (e)=>
{
    loadPlayer();
});


document.addEventListener("keyup", (e) =>
{
    if(e.code == "Enter" && document.querySelector('#Player').value != "" && document.querySelector('#Realm').value != "" && document.querySelector('#Region').value != "")
        loadPlayer();
});
