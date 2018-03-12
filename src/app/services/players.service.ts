import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class PlayersService {
    
	constructor(private http: Http) { }

	data = {};

	getPlayer(name: String) {
		this.data = {
			playerName: name
		}
		let body = JSON.stringify(this.data);
		let headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post('/api/action/getPlayerByName', body, {headers: headers})
      		.map(res => res.json())
			.catch(error => Observable.throw(error.json()));
	}

	upsertPlayer(player: {}) {
		this.data = {
			player: player
		}
		let body = JSON.stringify(this.data);
		let headers = new Headers({'Content-Type': 'application/json'});		
		return this.http.post('/api/action/upsertPlayer', body, {headers: headers})
      		.map(res => res.json())
			.catch(error => Observable.throw(error.json()));
	}
}