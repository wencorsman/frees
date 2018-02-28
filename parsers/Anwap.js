let request = require('request');
let cheerio = require('cheerio');
require('colors');


global.Anwap = class Anwap extends Parser{

	constructor(link) {
		super();
		this.global = `https://anwap.tv`;
		this.local = `/film`;
	}

	getdb(db) {
		this.db = db;
	}

	getList(page=1, next=false) {
		request(`${this.global}${this.local}s/p-${page}`, (err, res2, body) => {
			try{
				let $ = cheerio.load(body);
				$(`div.film a[href]`).each((i, el) => {
					this.getMovie($(el).attr(`href`));
				});
			} catch(err) {console.log('err'.red);}
			// console.log('anwap');
			if (next) setTimeout(()=>{this.getList(page+1, next);},1);
		});
		
	}

	getMovie(link='') {
		request(`${this.global}${link}`, (err, res2, body) => {
			try{
				let $ = cheerio.load(body);
				let data = {};
				data.title = $(`div.ball h1.blc span.acat`).text();
				let links = [];
				$(`div.blms ul.tl2 li a`).each((i, el) => {
					links.push(
					{
						"key":$(el).text().replace(/[\W]/,``).trim(),
						"value":`${this.global}${$(el).attr(`href`)}`
					}
					);
				});
				if (!Object.keys(links).length) throw new Error();
				data.links = links;
				this.db.update(data.title,data);
			} catch (err) {
				this.getSerial(body);
			}
		});
	}

	getSerial(body) {
		console.log('it is serial'.yellow);
	}

	next() {

	}

}