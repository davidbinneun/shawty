const fs = require('fs').promises;
const databaseFile = process.env.NODE_ENV === 'test' ? './backend/testdata.json':'./backend/data.json';

// Performs actions on the database file
class DataBase { 
    constructor(){
        this.items = [];
        const data = fs.readFile(databaseFile, 'utf8'); 
        this.items = JSON.parse(data);
    }

    async addItem(newItem){
        let match = this.items.find(item => item.originalUrl === newItem.originalUrl);
        if (match === null) throw new Error('Item exists');

        this.items.push(newItem);
        try {
            await fs.writeFile(databaseFile, JSON.stringify(this.items)); 
        }
        catch (e){
            throw new Error(e);
        }
    }

    async getItem(id){
        let match = this.items.find(item => item.id === id);
        if (match === null) throw new Error("Item doesn't exist");
        return match;
    }
}

module.exports = DataBase;