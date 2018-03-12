import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PlayersService } from '../services/players.service';

@Component({
	selector: 'app-round',
	templateUrl: './round.component.html',
	styleUrls: ['./round.component.css'],
	providers: [PlayersService],
})
export class RoundComponent implements OnInit {

	players: {
		_id: String, 
		name: String, 
		points: number, 
		currentPoints: number,
		playerNumber: number,
	}[] = [];
	existingMoves: {
		"move": String,
		"kills": String
	}[];
	currentPlayer: number;
	currentRound: {
		roundNumber: number,
		playerOneMove: String,
		playerTwoMove: String,
		winner: String
	};
	rounds: {
		roundNumber: number,
		playerOneMove: String,
		playerTwoMove: String,
		winner: String
	}[] = [];
	errorMessage: String = undefined;
	gameWinner: String;

	constructor(private route: ActivatedRoute,
				private playersService: PlayersService,
				private router: Router) {
		this.players = [ {
			_id: null, 
			name: '', 
			points: 0, 
			currentPoints: 0,
			playerNumber: 1,
		}, {
			_id: null, 
			name: '', 
			points: 0, 
			currentPoints: 0,
			playerNumber: 2,
		} ];
		this.createNewRound(1);
		this.currentPlayer = 1;
		this.existingMoves = [
			{
				"move": "Rock",
				"kills": "Scissors"
			},
			{
				"move": "Scissors",
				"kills": "Paper"
			},
			{
				"move": "Paper",
				"kills": "Rock"
			}
		];
	 }

	ngOnInit() {
		this.route.params.subscribe(params => {
			let p1 = params['playerOne'];
			let p2 = params['playerTwo'];

			this.playersService.getPlayer(p1)
			.subscribe(
				data => {
					if (!data.error) {
						if (data.obj.length) { //if found, assign
							let player1Updated = Object.assign(this.players[0], data.obj[0]);
							this.players[0] = player1Updated;
						} else { //else just add name
							this.players[0].name = p1;
						}
					}
				},
				error => { this.errorMessage = error; }
			);

			this.playersService.getPlayer(p2)
			.subscribe(
				data => {
					if (!data.error) {
						if (data.obj.length) { //if found, assign
							let player2Updated = Object.assign(this.players[1], data.obj[0]);
							this.players[1] = player2Updated;
						} else { //else just add name
							this.players[1].name = p2;
						}
					}
				},
				error => { this.errorMessage = error; }
			);
		});
	}


	/*
	 * Checks if player two played, and continues the round,
	 * or starts a new one
	 */
	nextPlayerOrRound(): void {
		if (this.currentPlayer === 1) {
			if (!this.currentRound.playerOneMove) { //they did not chose move
				this.errorMessage = 'You must choose a move';
			} else { //player 2 continues
				this.currentPlayer = 2;
			}
		} else { //current player 2
			if (!this.currentRound.playerTwoMove) { //they did not chose move
				this.errorMessage = 'You must choose a move';
			} else { //round finished, find winner and start a new one or finish
				this.checkRoundWinner();
				this.nextRoundOrFinish();
			}
		}	
	}

	nextRoundOrFinish(): void {
		let that = this;
		//add current round to rounds
		this.rounds.push(this.currentRound);	
		if (this.currentRound.roundNumber < 3) { //continue
			//create new round
			this.createNewRound(this.currentRound.roundNumber + 1);
			this.currentPlayer = 1;
		} else {//if tie, continue
			if (this.players[0].currentPoints === this.players[1].currentPoints) {
					//create new round
					this.createNewRound(this.currentRound.roundNumber + 1);
					this.currentPlayer = 1;
			} else if (this.players[0].currentPoints < 3 && this.players[1].currentPoints < 3) { //did not reach 3 pts
				//create new round
				this.createNewRound(this.currentRound.roundNumber + 1);
				this.currentPlayer = 1;
			} else {
				if (this.players[0].currentPoints === 3) { //player 1 won, add 1 point				
					this.gameWinner = this.players[0].name;
					this.players[0].points++;
				} else if (this.players[1].currentPoints === 3) { //player 2 won, add 1 point
					this.gameWinner = this.players[1].name;
					this.players[1].points++;
				}
				
				that.sendDataToDb(that.players[0], function() {
					that.sendDataToDb(that.players[1], function() {
						//go to winner page
						that.router.navigate(['/winner', that.gameWinner, 
							{p1: that.players[0].name, p1Pts: that.players[0].points, 
							p2: that.players[1].name, p2Pts: that.players[1].points}]);
					});					
				});				
			}
		} 
	}

	/**
	 * Send data to db
	 */
	 sendDataToDb(player: any, callback: Function) : void {
		let dbPlayer = {
			_id: player._id,
			name: player.name,
			points: player.points
		}
		this.playersService.upsertPlayer(player)
			.subscribe(
				data => {
					callback();
				},
				error => { this.errorMessage = error; }
			);
	 }

	/**
	 * Creates a new round
	 */
	createNewRound(roundNumber: number) : void {
		let newRound = {
			roundNumber: roundNumber,
			playerOneMove: undefined,
			playerTwoMove: undefined,
			winner: undefined
		} 
		//update current round 
		this.currentRound = newRound;
	}

	/*
	 * Checks who won the round
	 */
	checkRoundWinner() : void {
		let player1MoveObject = this.getMoveChosen(1);

		if (player1MoveObject[0].kills === this.currentRound.playerTwoMove) { //player 1 won round
			if (this.players[0]) {
				this.currentRound.winner = this.players[0].name;
				this.players[0].currentPoints++;
			}
		} else { //player 1 did not win, check if player 2 won
			let player2MoveObject = this.getMoveChosen(2);

			if (player2MoveObject[0].kills === this.currentRound.playerOneMove) {
				if (this.players[1]) {
					this.currentRound.winner = this.players[1].name;
					this.players[1].currentPoints++;
				}
			} else { //tie
				this.currentRound.winner = 'tie';
			}
		}
	}

	/*
	 * Gets the move that the player has chosen
	 * from the existing moves list to know what
	 * move it kills
	 */
	getMoveChosen(playerNumber : number) : Object {
		let round = this.currentRound;
		return this.existingMoves.filter(function(moveObj){
			if (playerNumber === 1) return moveObj.move === round.playerOneMove;
			else return moveObj.move === round.playerTwoMove;
		});
	}

}
