import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
	selector: 'app-winner',
	templateUrl: './winner.component.html',
	styleUrls: ['./winner.component.css']
})
export class WinnerComponent implements OnInit {

	gameWinner: String;
	players: {
		name: String,
		points: number
	}[] = [];

	constructor(private route: ActivatedRoute) {
		
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.gameWinner = params['gameWinner'];
			this.players.push({ 
				name: params['p1'],
				points: params['p1Pts']
			},
			{
				name: params['p2'] ,
				points: params['p2Pts']
			});
		});
		
		console.log('this.players', this.players);
	}

}