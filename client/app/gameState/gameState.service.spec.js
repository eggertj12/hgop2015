'use strict';

describe('Factory: TictacToeState', function () {

  var gameState;
  // load the controller's module
  beforeEach(module('tictactoeApp'));


  // Initialize the controller and a mock scope
  beforeEach(inject(function (_gameState_) {
    gameState = _gameState_();
  }));

  it('Should add other player to game state when gameJoined', function () {
    gameState.mutate([{
        event: 'GameJoined',
        userName: 'Gummi',
        name: 'TheFirstGame',
        timeStamp: '2014-12-02T11:29:29'
      }]
    );

    expect(gameState.joiningUser).toBe('Gummi');
  });

  it('Should store gameid and name from game created in game state.', function () {
    gameState.mutate([{
        event: 'GameCreated',
        gameId: '198299',
        userName: 'Gummi',
        name: 'TheFirstGame',
        timeStamp: '2014-12-02T11:29:29'
      }]
    );

    expect(gameState.gameId).toBe('198299');
    expect(gameState.name).toBe('TheFirstGame');
    expect(gameState.creatingUser).toBe('Gummi');
  });

  it('Should add moves 0,1 to game board', function () {

    gameState.mutate([{
        event: 'MovePlaced',
        userName: 'Gummi',
        name: 'TheFirstGame',
        timeStamp: '2014-12-02T11:29:29',
        boardX: '0',
        boardY: '1',
        player: 'X'
      }]
    );

    expect(gameState.board[0][1]).toBe('X');

  });

  it('Should add move 2,2 to board.', function () {

    gameState.mutate([{
        event: 'MovePlaced',
        userName: 'Gummi',
        name: 'TheFirstGame',
        timeStamp: '2014-12-02T11:29:29',
        boardX:2, 
        boardY:2,
        player: 'X'
      }]
    );

    expect(gameState.board[2][2]).toBe('X');

  });

  it('Should mark nextTurn as opposite from last event.', function () {
    gameState.me = {side: 'O'};
    gameState.mutate([{
        event: 'MovePlaced',
        userName: 'Gummi',
        name: 'TheFirstGame',
        timeStamp: '2014-12-02T11:29:29',
        boardX:2, 
        boardY:2,
        player: 'X'
      }]
    );

    expect(gameState.nextTurn).toBe('O');
  });

  it('Nextturn should default to X', function () {
    gameState.me = {side: 'X'};
    gameState.mutate([{
        event: 'GameCreated',
        userName: 'Gummi',
        name: 'TheFirstGame',
        timeStamp: '2014-12-02T11:29:29'
      }]
    );

    expect(gameState.nextTurn).toBe('X');
  });

  it('GameWon should set nextTurn to GameOver',function(){
    gameState.me = {side: 'X'};
    gameState.mutate([{
        event: 'GameWon',
        userName: 'Gummi',
        name: 'TheFirstGame',
        timeStamp: '2014-12-02T11:29:29'
      }]
    );

    expect(gameState.nextTurn).toBe('GameOver');
    expect(gameState.winner).toBe('Gummi');
  });

  it('GameDrawn should set nextTurn to GameOver',function(){
    gameState.me = {side: 'X'};
    gameState.mutate([{
        event: 'GameDrawn',
        userName: 'Gummi',
        name: 'TheFirstGame',
        timeStamp: '2014-12-02T11:29:29'
      }]
    );

    expect(gameState.nextTurn).toBe('GameOver');
    expect(gameState.gameDraw).toBe(true);
  });
});


