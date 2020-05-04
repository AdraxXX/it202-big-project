//**searchBars.js
//Author: Daniel Johnston
//This file is used to populate and control the input areas for the user.


//This will allow me to get the realms information
let apiConnectedRealmsEndpoint = "https://us.api.blizzard.com/data/wow/connected-realm/index?namespace=dynamic-us&locale=en_US";
let listOfRegions = [];
let Realms = []; 
let RealmNames = [];
let SlugName = {};
let RealmInfo = [];

// This fetch will get the api data for connected realms
fetch(apiConnectedRealmsEndpoint + token)
.then ( response => {return response.json()} )
.then ( (json) => {
// This for each will run through each set of connected realms
    for(let data of json.connected_realms)
    {
        let linkedRealmsURL = data;
        // This fetch will get the api data for the list of realms connected to each
        fetch(linkedRealmsURL.href + token)
        .then ( response => {return response.json()} )
        .then ( (realmsInfo) => {
            RealmInfo.push(realmsInfo);
            let ID = realmsInfo.id;
            let newRealms = realmsInfo.realms;
            // Store each list of connected realms for later use
            Realms.push(newRealms);

            // This for each will run through each realm and generate a list of regions
            for(let realm of newRealms)
            {
                let region = realm.category.en_US;
                if(!listOfRegions.includes(region))
                {
                    let newOption = document.createElement('option');

                    newOption.value = region;       
                    newOption.id = region;

                    document.querySelector('#region').appendChild(newOption);
                    listOfRegions.push(region);
                }
            }
        });
    }
    document.querySelector('#Region').parentNode.classList = "mdc-text-field mdc-text-field--filled mdc-text-field--fullwidth";
});


// This will fire when the Region name is filled out
document.querySelector('#Region').addEventListener('change', (e)=>
{
    // This will reset the value of the realm name text area
    document.querySelector('#Realm').value = "";
    RealmNames = [];
    let parentOfRealms = document.querySelector('#realms').parentNode;
    let foundRegion = false;

    // This for each will clear out the current list of realms
    for(let childToRemove of document.querySelector('#realms').childNodes)
    {
        document.querySelector('#realms').remove(childToRemove);
        let newDataList = document.createElement('datalist');
        
        newDataList.id = "realms";
        parentOfRealms.appendChild(newDataList);
    }

    // This will check to see if the region is even in the list of regions
    for(let region of listOfRegions)
    {
        if(region == document.querySelector('#Region').value)
        {
            foundRegion = true;
            break;
        }
    }

    // if we found the region in the list this will fire
    if(foundRegion)
    {
        // This for each breaks down the connected realms list in an array of realms
        for(let listRealms of Realms )
        {
            // This for each loop will run through the array of realms creating options for the Realm name list
            for(let realm of listRealms)
            {
                let region = realm.category.en_US;

                // This will tell allow us to only have options for realms within the current region
                if(document.querySelector('#Region').value == region)
                {
                    let realmName = realm.name.en_US;
                    let slug = realm.slug;
                    let newOption = document.createElement('option');

                    newOption.value = realmName;

                    document.querySelector('#realms').appendChild(newOption);
                    RealmNames.push(realmName);
                    SlugName[realmName] = slug;
                }
            }
        }
    }

    // This if else will allow us to disable to text area if the use has no yet input a region
    if(document.querySelector('#realms').childNodes.length > 0)
        document.querySelector('#realms').parentNode.classList = "mdc-text-field mdc-text-field--filled mdc-text-field--fullwidth";
    else
        document.querySelector('#realms').parentNode.classList = "mdc-text-field mdc-text-field--filled mdc-text-field--fullwidth mdc-text-field--disabled";
});


// This function is used to make an event listener for when there is change to the realm name
document.querySelector('#Realm').addEventListener('change', (e)=>
{
    let foundRealm = false;
    document.querySelector('#Player').value = "";
    // This if statement will check to make sure the realm name is not empty
    if(document.querySelector('#Realm').value != "")
        // This for each loop is used to check to see if the current input in the realm list is in the list of realm names
        for(let name of RealmNames)
            if(document.querySelector('#Realm').value == name)
                foundRealm = true;
    
    // This if else is used to make the player name area useable if the realm name was found
    if(foundRealm)
        document.querySelector('#Player').parentNode.classList = "mdc-text-field mdc-text-field--filled mdc-text-field--fullwidth";
    else
        document.querySelector('#Player').parentNode.classList = "mdc-text-field mdc-text-field--filled mdc-text-field--fullwidth mdc-text-field--disabled";
});


// This function is used to make an event listener for when there is change to the player name
document.querySelector('#Player').addEventListener('change', (e)=>
{
    // This if statement will check to make sure the realm name is not empty
    if(document.querySelector('#Player').value != "")
        document.querySelector('#playerSearch').disabled = false;
    else
        document.querySelector('#playerSearch').disabled = true;
});