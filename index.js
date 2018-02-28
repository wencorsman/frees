require('./classes/DataBase');
require('./parsers/Parser.js');
require('./parsers/Kinotut.js');
require('./parsers/Anwap.js');
require('colors');


let db = new DataBase(() => {
	// let kinotut = new Kinotut(); kinotut.getdb(db); kinotut.getList(0, true);
	// let anwap = new Anwap(); anwap.getdb(db); anwap.getList(1, true);

});

class Frees {

	constructor() {
		this.bot = require('./config/Secret').frees;

	}

    save() {
        db.coll.find({}).sort({title:1}).toArray((err, arr) => {
            for(let v of arr) {
                v.links = [v.links[v.links.length - 1]];
                delete v._id;
            }
            let fs = require('fs');
            fs.writeFile('movies.json', JSON.stringify(arr), (err) => {
                console.log(err);
            });
        });
    }

}

let bot = new Frees();

module.exports = bot;