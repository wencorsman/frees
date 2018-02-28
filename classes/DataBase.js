let MongoClient = require('mongodb').MongoClient;
const config = require('../config');
require('colors');

global.DataBase = class DataBase {

	constructor(cb) {
		MongoClient.connect(config.link_db, (error, db) => {
			if (error) return console.log(error);
			this.db = db;
			this.coll = db.collection('movies');
			cb(this.db);
		});
	}

	find() {
		return this.coll.find(arguments);
	}
	
	insert(){}
	
	remove(){}
	
	update(title, data, cb=function(err, docs) {
		if (docs.result.upserted) console.log('new'.green);
		// else console.log('nope'.grey);
	}) {
		this.coll.update({title: title}, data, {upsert: true}, cb);
	}

	getColl(col){
		return this.db.collection(col);
	}
	
}