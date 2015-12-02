'use strict';
var tictactoeCommandHandler = require('./tictactoeCommandHandler');

function createGameEvents(moves) {
	var events = [];
	var counter = 1;
		
	events.push({
		id: '1',
		event: 'GameCreated',
		gameName: 'TestGame',
		userName: 'Player1',
		timeStamp: '2015.12.02T15:32:00'
	});

	events.push({
		id: '2',
		event: 'GameJoined',
		gameName: 'TestGame',
		userName: 'Player2',
		otherUserName: 'Player1',
		timeStamp: '2015.12.02T15:32:30'
	});

	moves.forEach(function(move) {
		events.push({
			id: counter + 2 + '',
			event: 'MovePlaced',
			boardX: move.boardX,
			boardY: move.boardY,
			player: move.player,
			gameName: 'TestGame',
			userName: (counter % 2 == 1 ? 'Player1' : 'Player2'),
			timeStamp: '2015.12.02T15:00:' + (counter + 10)
		});
		counter++;
	}, this);
	
	return events;
};

describe('create game command', function () {
	var given, when, then;

	it('should create game', function () {
		given = [];
		when = {
			id: '1234',
			command: 'CreateGame',
			gameName: 'FirstGame',
			userName: 'Gulli',
			timeStamp: '2015.12.02T11:29:44'
		};
		then = [{
			id: '1234',
			event: 'GameCreated',
			gameName: 'FirstGame',
			userName: 'Gulli',
			timeStamp: '2015.12.02T11:29:44'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should create another game for another user', function () {
		given = [];
		when = {
			id: '9876',
			command: 'CreateGame',
			gameName: 'MyGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T14:41:12'
		};
		then = [{
			id: '9876',
			event: 'GameCreated',
			gameName: 'MyGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T14:41:12'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});
});

describe('join game command', function () {
	var given, when, then;

	it('should join game', function () {
		given = [{
			id: '1234',
			event: 'GameCreated',
			userName: 'Gulli',
			gameName: 'FirstGame',
			timeStamp: '2015.12.02T11:29:44'
		}];
		when = {
			id: '1238',
			command: 'JoinGame',
			gameName: 'FirstGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T11:30:14'
		};
		then = [{
			id: '1238',
			event: 'GameJoined',
			gameName: 'FirstGame',
			userName: 'Eggert',
			otherUserName: 'Gulli',
			timeStamp: '2015.12.02T11:30:14'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not join game if no game started', function () {
		given = [];
		when = {
			id: '5432',
			command: 'JoinGame',
			gameName: 'FirstGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:30:54'
		};
		then = [{
			id: '5432',
			event: 'GameNotFound',
			gameName: 'FirstGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:30:54'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not join game if already joined', function () {
		given = [{
			id: '678',
			event: 'GameCreated',
			gameName: 'FunGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T14:41:12'
		},
			{
				id: '6789',
				event: 'GameJoined',
				gameName: 'FunGame',
				userName: 'Eggert',
				otherUserName: 'Gulli',
				timeStamp: '2015.12.02T14:55:14'
			}];
		when = {
			id: '97838',
			command: 'JoinGame',
			gameName: 'FunGame',
			userName: 'Patty',
			timeStamp: '2015.12.02T15:06:54'
		};
		then = [{
			id: '97838',
			event: 'GameFull',
			gameName: 'FunGame',
			userName: 'Patty',
			timeStamp: '2015.12.02T15:06:54'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});
});

describe('place move command', function () {
	var given, when, then;

	it('should not place move if no game started', function () {
		given = [];
		when = {
			id: '7483',
			command: 'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'X',
			gameName: 'FirstGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:36:00'
		};
		then = [{
			id: '7483',
			event: 'GameNotFound',
			gameName: 'FirstGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:36:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not place move if game not full', function () {
		given = [{
			id: '5374',
			event: 'GameCreated',
			userName: 'Freyja',
			gameName: 'SomeGame',
			timeStamp: '2015.12.02T09:29:44'
		}];
		when = {
			id: '7483',
			command: 'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'X',
			gameName: 'SomeGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T09:36:00'
		};
		then = [{
			id: '7483',
			event: 'GameNotReady',
			gameName: 'SomeGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T09:36:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should place move on fresh game', function () {
		given = createGameEvents([]);
		when = {
			id: '977',
			command: 'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		};
		then = [{
			id: '977',
			event: 'MovePlaced',
			boardX: '0',
			boardY: '0',
			player: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not allow move on occupied cell', function () {
		var moves = [
			{
				boardX : '0',
				boardY : '0',
				player : 'X'
			}	
		];
		given = createGameEvents(moves);
		when = {
			id: '977',
			command: 'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		};
		then = [{
			id: '977',
			event: 'AlreadyFilled',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not allow Y to move first', function () {
		var moves = [];
		given = createGameEvents(moves);
		when = {
			id: '977',
			command: 'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'Y',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		};
		then = [{
			id: '977',
			event: 'InvalidPlayer',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not allow X to move after 3 moves', function () {
		var moves = [
			{
				boardX : '0',
				boardY : '0',
				player : 'X'
			},	
			{
				boardX : '1',
				boardY : '1',
				player : 'Y'
			},	
			{
				boardX : '0',
				boardY : '1',
				player : 'X'
			}			
		];
		given = createGameEvents(moves);
		when = {
			id: '977',
			command: 'PlaceMove',
			boardX: '0',
			boardY: '2',
			player: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T16:35:00'
		};
		then = [{
			id: '977',
			event: 'InvalidPlayer',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T16:35:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should allow X to win on a column', function () {
		var moves = [
			{
				boardX : '0',
				boardY : '0',
				player : 'X'
			},	
			{
				boardX : '1',
				boardY : '1',
				player : 'Y'
			},	
			{
				boardX : '0',
				boardY : '1',
				player : 'X'
			},	
			{
				boardX : '1',
				boardY : '0',
				player : 'Y'
			}			
		];
		given = createGameEvents(moves);
		when = {
			id: '977',
			command: 'PlaceMove',
			boardX: '0',
			boardY: '2',
			player: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:01:13'
		};
		then = [{
			id: '977',
			event: 'MovePlaced',
			boardX: '0',
			boardY: '2',
			player: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:01:13'
		},
		{
			id: '977',
			event: 'GameWon',
			winningPlayer: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:01:13'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should allow Y to win on a row', function () {
		var moves = [
			{
				boardX : '0',
				boardY : '0',
				player : 'X'
			},	
			{
				boardX : '1',
				boardY : '1',
				player : 'Y'
			},	
			{
				boardX : '0',
				boardY : '2',
				player : 'X'
			},	
			{
				boardX : '0',
				boardY : '1',
				player : 'Y'
			},	
			{
				boardX : '2',
				boardY : '2',
				player : 'X'
			}			
		];
		given = createGameEvents(moves);
		when = {
			id: '977',
			command: 'PlaceMove',
			boardX: '2',
			boardY: '1',
			player: 'Y',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:18:53'
		};
		then = [{
			id: '977',
			event: 'MovePlaced',
			boardX: '2',
			boardY: '1',
			player: 'Y',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:18:53'
		},
		{
			id: '977',
			event: 'GameWon',
			winningPlayer: 'Y',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:18:53'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should allow X to win on diagonal from 0,0 to 2,2', function () {
		var moves = [
			{
				boardX : '0',
				boardY : '0',
				player : 'X'
			},	
			{
				boardX : '1',
				boardY : '0',
				player : 'Y'
			},	
			{
				boardX : '2',
				boardY : '2',
				player : 'X'
			},	
			{
				boardX : '2',
				boardY : '0',
				player : 'Y'
			}			
		];
		given = createGameEvents(moves);
		when = {
			id: '977',
			command: 'PlaceMove',
			boardX: '1',
			boardY: '1',
			player: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:24:57'
		};
		then = [{
			id: '977',
			event: 'MovePlaced',
			boardX: '1',
			boardY: '1',
			player: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:24:57'
		},
		{
			id: '977',
			event: 'GameWon',
			winningPlayer: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:24:57'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should allow Y to win on diagonal from 0,2 to 2,0', function () {
		var moves = [
			{
				boardX : '0',
				boardY : '0',
				player : 'X'
			},	
			{
				boardX : '2',
				boardY : '0',
				player : 'Y'
			},	
			{
				boardX : '1',
				boardY : '0',
				player : 'X'
			},	
			{
				boardX : '0',
				boardY : '2',
				player : 'Y'
			},	
			{
				boardX : '0',
				boardY : '1',
				player : 'X'
			}			
		];
		given = createGameEvents(moves);
		when = {
			id: '977',
			command: 'PlaceMove',
			boardX: '1',
			boardY: '1',
			player: 'Y',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:29:07'
		};
		then = [{
			id: '977',
			event: 'MovePlaced',
			boardX: '1',
			boardY: '1',
			player: 'Y',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:29:07'
		},
		{
			id: '977',
			event: 'GameWon',
			winningPlayer: 'Y',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:29:07'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should allow game to be drawn', function () {
		var moves = [
			{
				boardX : '1',
				boardY : '0',
				player : 'X'
			},	
			{
				boardX : '0',
				boardY : '0',
				player : 'Y'
			},	
			{
				boardX : '2',
				boardY : '1',
				player : 'X'
			},	
			{
				boardX : '2',
				boardY : '0',
				player : 'Y'
			},	
			{
				boardX : '1',
				boardY : '1',
				player : 'X'
			},	
			{
				boardX : '0',
				boardY : '1',
				player : 'Y'
			},	
			{
				boardX : '0',
				boardY : '2',
				player : 'X'
			},	
			{
				boardX : '1',
				boardY : '2',
				player : 'Y'
			}			
		];
		given = createGameEvents(moves);
		when = {
			id: '977',
			command: 'PlaceMove',
			boardX: '2',
			boardY: '2',
			player: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:41:05'
		};
		then = [{
			id: '977',
			event: 'MovePlaced',
			boardX: '2',
			boardY: '2',
			player: 'X',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:41:05'
		},
		{
			id: '977',
			event: 'GameDrawn',
			gameName: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:41:05'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});
});
