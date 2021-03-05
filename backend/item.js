const shortid = require('shortid');

class Item {
    constructor(url){
        this.creationDate = getIsraeliDate(new Date());
        this.redirectCount = 0;
        this.originalUrl = url;
        this.id = shortid.generate();
    }
}

function getIsraeliDate(date){
    return addZero(date.getDate()) + "/" + addZero(date.getMonth() + 1) + "/" + date.getFullYear();

    function addZero(number){
        if (number < 10)
            return "0" + number;
        else
            return number;
    }
}

module.exports = Item;