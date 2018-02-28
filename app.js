let express = require('express');
let cheerio = require('cheerio');
let request = require('request');
let config = require('./config');

require('./classes/DataBase');
require('./parsers/Parser.js');
require('./parsers/Kinotut.js');
require('./parsers/Anwap.js');
require('colors');

let app = express();

app.use(express.static(`${__dirname}/public`));

let db = new DataBase(() => {
	// let kinotut = new Kinotut(); kinotut.getdb(db); kinotut.getList(0, true);
	// let anwap = new Anwap(); anwap.getdb(db); anwap.getList(1, true);

	// save();
});


app.get(`/showMovies`, (req, res) => {
	let s = ``;
	db.coll.find({}).sort({title:1}).toArray((err, arr) => {
		for (let i of arr) {
			s+=`<a href="${i.links[i.links.length - 1].value}" target="_blank">${i.title}</a><br>`;
		}
		res.end(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>LINKS</title></head><body>${s}</body></html>`);
	});
});

app.get(`/getJSON`, (req, res) => {
	db.coll.find({}).sort({title:1}).toArray((err, arr) => {
		for(let v of arr) {
			v.links = [v.links[v.links.length - 1]];
			delete v._id;
		}
		res.end(JSON.stringify(arr));
	});
});

function save() {
	db.coll.find({}).sort({title:1}).toArray((err, arr) => {
		for(let v of arr) {
			v.links = [v.links[v.links.length - 1]];
			delete v._id;
		}
		let fs = require('fs');
		fs.writeFile('movies.json', JSON.stringify(arr), (err) => {
			console.log(err);
		});
		delete fs;
	});
}

app.listen(8080);