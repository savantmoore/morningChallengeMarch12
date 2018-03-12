import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { RoundComponent } from './round/round.component';
import { HomeComponent } from './home/home.component';
import { WinnerComponent } from './winner/winner.component';
import { ScoreComponent } from './score/score.component';

import { PlayersService } from './services/players.service';

// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'round/:playerOne/:playerTwo',
    component: RoundComponent
  },
  {
    path: 'winner/:gameWinner',
    component: WinnerComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RoundComponent,
    HomeComponent, 
    WinnerComponent,
    ScoreComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    CommonModule
  ],
  providers: [ PlayersService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
