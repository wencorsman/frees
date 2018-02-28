let request = require('request');
let cheerio = require('cheerio');
require('colors');

global.Kinotut = class Kinotut extends Parser{

	constructor(link) {
		super();
		this.global = `http://kinotut.tv`;
		this.local = `/new_video.html`;
	}

	getdb(db) {
		this.db = db;
	}

	getList(page=0, next=false) {
		request(`${this.global}${this.local}?page=${page}`,(err, res2, body) => {
			try{
				let $ = cheerio.load(body);
				$(`div[id^="film"][onclick]`).each((i, el) => {
					this.getMovie($(el).find(`td a`).attr(`href`));
				});
			} catch (err) {
				console.log('err'.red);
			}
			// console.log('kinotut');
			if (next) setTimeout(()=>{this.getList(page+1, next);},1);
		});
		
	}

	getMovie(link='') {
		request(`${this.global}${link}`, (err, res2, body) => {
			try{
				let $ = cheerio.load(body);
				let data = {};
				data.title = $(`div.title`).text();
				let links = [];
				$(`#download_list`).find(`div[style*="padding-top"]`).each((i, el) => {
					links.push(
					{
						"key":$(el).text().replace(/[\W]/,``).trim(),
						"value":`${this.global}${$(el).next().find(`a`).attr(`href`)}`
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