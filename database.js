const shortid = require('shortid');
const fs = require('fs').promises;

class DataBase {
    static items = [];

    // Gets all data from the JSON file into the items array
    static async readAllData(){
        const data = await fs.readFile('./data.json', 'utf8' , (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
          });

          let dataParsed = JSON.parse(data);
          this.items = dataParsed.record;
    }

    // Receives URL, adds it to database and returns the id given to it
    static async addURL(body){
        await this.readAllData();
        
        // Check if URL exists in database
        for(let item of this.items){
            if (body.url == item.originalUrl){
                return item.id; // URL exists, returns its id
            }
        }

        // If URL is new, add to database and return id
        let newItem = {creationDate: Date.now(), redirectCount: 0, originalUrl: body.url, id: shortid.generate()};
        this.items.push(newItem);
        fs.writeFile(`data.json`, JSON.stringify({"record": this.items}));
        return newItem.id;
    }

    // Receives id, returns the URL it has
    static async getOriginalUrl(id){
        await this.readAllData();
        for (let item of this.items){
            if (id == item.id){
                item.redirectCount += 1;
                fs.writeFile(`data.json`, JSON.stringify({"record": this.items}));
                return item.originalUrl;
            }
        }

        return null;
    }

    // Receives id, returns the full item object
    static async getItem(id){
        await this.readAllData();
        for (let item of this.items){
            if (id == item.id){
                return item;
            }
        }
        return null;
    }
}

module.exports = DataBase;