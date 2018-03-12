import { GameOfDronesPage } from './app.po';

describe('game-of-drones App', function() {
  let page: GameOfDronesPage;

  beforeEach(() => {
    page = new GameOfDronesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
