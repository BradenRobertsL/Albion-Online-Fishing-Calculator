var canvas;

var fishData = {
    "T7_FISH_FRESHWATER_HIGHLANDS_RARE": '{"name": "T7 Thunderfall Lurcher", "tier":"T7", "choppedFish":"30", "price":"0"}',
    "T5_FISH_FRESHWATER_HIGHLANDS_RARE": '{"name": "T5 Rushwater Lurcher", "tier":"T5", "choppedFish":"20", "price":"0"}',
    "T3_FISH_FRESHWATER_HIGHLANDS_RARE": '{"name": "T3 Stonestream Lurcher", "tier":"T3", "choppedFish":"10", "price":"0"}',
    "T7_FISH_FRESHWATER_FOREST_RARE": '{"name": "T7 Deadwater Eel", "tier":"T7", "choppedFish":"30", "price":"0"}',
    "T5_FISH_FRESHWATER_FOREST_RARE": '{"name": "T5 Redspring Eel", "tier":"T5", "choppedFish":"20", "price":"0"}',
    "T3_FISH_FRESHWATER_FOREST_RARE": '{"name": "T3 Greenriver Eel", "tier":"T3", "choppedFish":"10", "price":"0"}',
    "T8_FISH_FRESHWATER_ALL_COMMON": '{"name": "T8 River Sturgeon", "tier":"T8", "choppedFish":"14", "price":"0"}',
    "T7_FISH_FRESHWATER_ALL_COMMON": '{"name": "T7 Danglemouth Catfish", "tier":"T7", "choppedFish":"10", "price":"0"}',
    "T6_FISH_FRESHWATER_ALL_COMMON": '{"name": "T6 Brightscale Zander", "tier":"T6", "choppedFish":"8", "price":"0"}',
    "T5_FISH_FRESHWATER_ALL_COMMON": '{"name": "T5 Spotted Trout", "tier":"T5", "choppedFish":"8", "price":"0"}',
    "T1_FISHCHOPS": '{"name": "T1 Chopped Fish", "tier":"T1", "price":"0"}'
}

function setup() {
    var selector = select('#fishSelector');

    for (var key in fishData) {
        var itemData = JSON.parse(fishData[key]);
        var option = createElement('option', itemData.name);
        option.parent(selector);
        option.value(key);
        option.addClass(itemData.tier);

    }


    updatePrices();
}

// Adds fish to calculator list
function addFishToList() {
    var fishType = select('#fishSelector').value();
    var fish = JSON.parse(fishData[fishType]);

    var content = '<th scope="row"> <img class="icon-image" src="images/' + fishType + '.png"> </th> <td> <input class="form-control" type ="number" value ="1" id = "number-input" onchange="updateTable()"> </td > <td id="silver"></td> <td id="silver-fishchop"></td> <td><button class = "btn btn-danger"onclick = "removeFromList(this)">Remove</button></td>';
    var element = createElement('tr', content);
    element.parent(select('#fishList'));
    element.attribute('fishType', fishType);
    element.id("fishListing");

    updatePrices();
}

// Removes fish from calculator list
function removeFromList(object) {
    var container = object.parentNode.parentNode;
    container.remove();
}

// Updates table with current saved data
function updateTable() {
    var choppedFishPrice = JSON.parse(fishData['T1_FISHCHOPS']).price;
    var tableElements = selectAll("tr");


    for (var int = 1; int < tableElements.length; int++) {
        var element = tableElements[int];
        var fishName = element.attribute('fishType');
        var itemData = JSON.parse(fishData[fishName]);

        var amount = select('input', element).value();
        var silver = amount * itemData.price;
        var silver_fishchop = ((amount * itemData.choppedFish) * choppedFishPrice) - silver;

        var children = element.child();
        children[4].innerHTML = silver;
        if (silver_fishchop < 0) {
            children[6].innerHTML = silver_fishchop;
            children[6].className = "negative";
        } else {
            children[6].innerHTML = '+' + silver_fishchop;
            children[6].className = "positive";
        }
    }
}

// Updates saved data with current market prices
function updatePrices() {
    for (var item in fishData) {
        var itemData = JSON.parse(fishData[item]);
        var url = 'https://www.albion-online-data.com/api/v1/stats/Prices/' + item + '?locations=Caerleon';
        loadJSON(url, updateData);
    }

    updateTable();
}

// Takes JSON of data (itemData) and updates the correct fish in the saved fishData
function updateData(data) {
    var itemData = JSON.parse(fishData[data[0].item_id]);
    itemData.price = data[0].sell_price_min;

    fishData[data[0].item_id] = JSON.stringify(itemData);
}