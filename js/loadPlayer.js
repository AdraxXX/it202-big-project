

let loadPlayer = () =>
{
    if(document.querySelector('#Player').value != "" && document.querySelector('#Realm').value != "" && document.querySelector('#Region').value != "")
    {
        let realm = SlugName[document.querySelector('#Realm').value];
        let apiEndpointCharacterProfile = "https://us.api.blizzard.com/profile/wow/character/" + realm + "/" + document.querySelector('#Player').value.toLowerCase() + "?namespace=profile-us&locale=en_US"
        let apiEndpointCharacterEncounter = "https://us.api.blizzard.com/profile/wow/character/" + realm + "/" + document.querySelector('#Player').value.toLowerCase() + "/encounters?namespace=profile-us&locale=en_US";
        let apiEndPointCharacterEquip = "https://us.api.blizzard.com/profile/wow/character/" + realm + "/" + document.querySelector('#Player').value.toLowerCase() + "/equipment?namespace=profile-us&locale=en_US"
        let apiEndPointCharacterPicture = "https://us.api.blizzard.com/profile/wow/character/" + realm + "/" + document.querySelector('#Player').value.toLowerCase() + "/character-media?namespace=profile-us&locale=en_US"
        fetch(apiEndpointCharacterEncounter + token)
        .then ( response => {
            if (!response.ok) 
              throw new Error('Player Not found');
            return response.json();
        })
        .then ( (json) => {
            //console.log(json);
//             fetch(json.raids.href + token)
//             .then ( response => {return response.json()} )
//             .then ( (raids) => {
//                 console.log(raids);
//             });
               let playerLevel = 0;
               fetch(apiEndpointCharacterProfile + token)   
               .then ( response => {return response.json()} )
               .then ( (player) => {
                  console.log(player);
                  playerLevel = player.level;
                  if(playerLevel != 120)
                      throw new Error('Player not max level');
                   
                  fetch(apiEndPointCharacterEquip + token)
                  .then ( response => {return response.json()} )
                  .then ( (gear) => {
                       for(let equippedItems of gear.equipped_items)
                       {
                           let apiEndPointItem = equippedItems.media.key.href;
                           let slotType = "";

                           for(let slotName of equippedItems.slot.name.split(" "))
                               slotType += slotName;

                           fetch(apiEndPointItem + token)
                           .then ( response => {return response.json()} )
                           .then ( (item) => {
                               document.querySelector("#" + slotType + "Slot").src = item.assets[0].value;
                           });
                       }
                   });

                   fetch(apiEndPointCharacterPicture + token)
                   .then ( response => {return response.json()} )
                   .then ( (character) => {
                       document.querySelector(".characterImage").src = character.render_url;
                   });

                   for(let viewScreen of document.querySelector('main').querySelectorAll('.view'))
                   {
                        if(viewScreen.id == "characterScreen")
                            viewScreen.style.display = "block";
                        else
                            viewScreen.style.display = "none";
                   }
               })
               .catch(error => {
                   document.querySelector("#alertText").textContent = "Search for " + document.querySelector('#Player').value + " is not max level.";
                   document.querySelector("#alertMessage").style.display = "block";
               });
        })
        .catch(error => {
            document.querySelector("#alertText").textContent = "Search for " + document.querySelector('#Player').value + " on " + document.querySelector('#Realm').value + " failed.";
            document.querySelector("#alertMessage").style.display = "block";
        });
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
