
let getPivotScore = (keystoneRun) =>
{
    return keystoneRun.level * 10000 + (5900 - keystoneRun.min * 10) + (59 - keystoneRun.seconds);
};

let partition = (itemsToSort, leftPivot, rightPivot) =>
{
    let done = false;
    let midpoint = Math.trunc(leftPivot + (rightPivot - leftPivot) / 2);
    
    let pivot = itemsToSort[midpoint];
    let pivotScore = getPivotScore(pivot);
    
    let low = leftPivot;
    let high = rightPivot;
    
    while(!done)
    {
        while(getPivotScore(itemsToSort[low]) > pivotScore)
            ++low;
        while(pivotScore > getPivotScore(itemsToSort[high]))
            --high;
        
        if(low >= high)
            done = true;
        else
        {
            let temp = itemsToSort[low];
            itemsToSort[low] = itemsToSort[high];
            itemsToSort[high] = temp;
            
            ++low;
            --high;
        }
    }
    return high;
};


let quickSort = (itemsToSort, leftPivot, rightPivot) =>
{
    let j = 0;
    
    if(leftPivot >= rightPivot)
        return;
    
    j = partition(itemsToSort, leftPivot, rightPivot);
    
    quickSort(itemsToSort, leftPivot, j);
    quickSort(itemsToSort, j + 1, rightPivot);
    doneSorted = true;
};

for(let dungonToSort in storedKeystones)
    quickSort(storedKeystones[dungonToSort], 0, storedKeystones[dungonToSort].length - 1);