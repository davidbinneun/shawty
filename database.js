const shortid = require('shortid');
const fs = require('fs').promises;

class DataBase {
    static items = [];

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

    static async addURL(body){
        await this.readAllData();
        this.items.push({creationDate: Date.now(), redirectCount: 0, originalUrl: body.url, id: shortid.generate()});
        fs.writeFile(`data.json`, JSON.stringify({"record": this.items}));
    }

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