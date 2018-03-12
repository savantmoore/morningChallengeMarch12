import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	playerOne: String;
	playerTwo: String;
	errorMessage: String = undefined;

	constructor(private router: Router) {
		
	 }

	ngOnInit() { }

	onSubmit(): void {
		if (!this.playerOne || !this.playerTwo || 
			!this.playerOne.trim().length || !this.playerTwo.trim().length) {
			this.errorMessage = 'Names cannot be blank!';
		} else if (this.sanitizeName(this.playerOne) === this.sanitizeName(this.playerTwo)) {
			this.errorMessage = 'You cannot play against yourself!';
		} else {
			this.router.navigate(['/round', this.sanitizeName(this.playerOne), this.sanitizeName(this.playerTwo)]);
		}
	}

	sanitizeName(name) : String {
		return name.charAt(0).toUpperCase() + name.toLowerCase().trim().slice(1);
	}

}
