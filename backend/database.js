const fs = require('fs').promises;
const Item = require('./item.js');
const databaseFile = process.env.NODE_ENV === 'test' ? './backend/testdata.json':'./backend/data.json';
const isUrl = require("is-valid-http-url");

// Performs actions on the database file
class DataBase { 
    static items = [];

    // Gets all data from the JSON file into the items array
    static async readAllData(){
        const data = await fs.readFile(databaseFile, 'utf8' , err => { if (err) return;}); // TODO remove callback
        this.items = JSON.parse(data);
    }

    // Receives URL, adds it to database and returns the id given to it
    static async addURL(url){
        await this.readAllData();

        // Check if URL is legal
        if (!isUrl(url)) return null; // TODO take this out
        
        // Check if URL exists in database
        for(let item of this.items){
            if (url === item.originalUrl) {
                return item.id; // URL exists, returns its id
            }
        }
        // If URL is new, add to database and return id
        let newItem = new Item(url);
        this.items.push(newItem);
        fs.writeFile(databaseFile, JSON.stringify(this.items));
        return newItem.id;
    }

    // Receives id, returns the URL it has
    static async getOriginalUrl(id){
        await this.readAllData();
        for (let item of this.items){
            if (item.id === id){
                item.redirectCount += 1;
                fs.writeFile(databaseFile, JSON.stringify(this.items));
                return item.originalUrl;
            }
        }

        return null;
    }

    // Receives id, returns the full item object
    static async getItem(id){
        await this.readAllData();
        for (let item of this.items){
            if (item.id === id){
                return item;
            }
        }
        return null; // TODO throw error incase of error
    }
}

module.exports = DataBase;