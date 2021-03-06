'use strict';
var tictactoeCommandHandler = require('./tictactoeCommandHandler');
var testMoveFactory = require('./testMoveFactory')();

describe('place move command', function () {
	var given, when, then;

	it('should not place move if no game started', function () {
		given = [];
		when = {
			id: '7483',
			gameId: 'jeikcoe',
			comm: 'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'X',
			name: 'FirstGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:36:00'
		};
		then = [{
			id: '7483',
			gameId: 'jeikcoe',
			event: 'GameNotFound',
			name: 'FirstGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:36:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not place move if game not full', function () {
		given = [{
			id: '5374',
			gameId: 'jdkie',
			event: 'GameCreated',
			userName: 'Freyja',
			name: 'SomeGame',
			timeStamp: '2015.12.02T09:29:44'
		}];
		when = {
			id: '7483',
			gameId: 'jdkie',
			comm: 'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'X',
			name: 'SomeGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T09:36:00'
		};
		then = [{
			id: '7483',
			gameId: 'jdkie',
			event: 'GameNotReady',
			name: 'SomeGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T09:36:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should place move on fresh game', function () {
		given = testMoveFactory.createGameEvents([]);
		when = {
			id: '977',
			gameId: 'idsaregood',
			comm: 'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		};
		then = [{
			id: '977',
			gameId: 'idsaregood',
			event: 'MovePlaced',
			boardX: '0',
			boardY: '0',
			player: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not allow move on occupied cell', function () {
		var moves = [
			testMoveFactory.createMove('0', '0', 'X')
		];
		given = testMoveFactory.createGameEvents(moves);
		when = {
			id: '977',
			gameId: 'idsaregood',
			comm: 'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		};
		then = [{
			id: '977',
			gameId: 'idsaregood',
			event: 'AlreadyFilled',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not allow O to move first', function () {
		var moves = [];
		given = testMoveFactory.createGameEvents(moves);
		when = {
			id: '977',
			gameId: 'idsaregood',
			comm: 'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'O',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		};
		then = [{
			id: '977',
			gameId: 'idsaregood',
			event: 'InvalidPlayer',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T15:00:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not allow X to move after 3 moves', function () {
		var moves = [
			testMoveFactory.createMove('0', '0', 'X'),
			testMoveFactory.createMove('1', '1', 'O'),
			testMoveFactory.createMove('0', '1', 'X')
		];
		given = testMoveFactory.createGameEvents(moves);
		when = {
			id: '977',
			gameId: 'idsaregood',
			comm: 'PlaceMove',
			boardX: '0',
			boardY: '2',
			player: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T16:35:00'
		};
		then = [{
			id: '977',
			gameId: 'idsaregood',
			event: 'InvalidPlayer',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T16:35:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should allow X to win on a column', function () {
		var moves = [
			testMoveFactory.createMove('0', '0', 'X'),
			testMoveFactory.createMove('1', '1', 'O'),
			testMoveFactory.createMove('0', '1', 'X'),
			testMoveFactory.createMove('1', '0', 'O')
		];
		given = testMoveFactory.createGameEvents(moves);
		when = {
			id: '977',
			gameId: 'idsaregood',
			comm: 'PlaceMove',
			boardX: '0',
			boardY: '2',
			player: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:01:13'
		};
		then = [{
			id: '977',
			gameId: 'idsaregood',
			event: 'MovePlaced',
			boardX: '0',
			boardY: '2',
			player: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:01:13'
		},
		{
			id: '977',
			gameId: 'idsaregood',
			event: 'GameWon',
			winningPlayer: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:01:13'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should allow O to win on a row', function () {
		var moves = [
			testMoveFactory.createMove('0', '0', 'X'),
			testMoveFactory.createMove('1', '1', 'O'),
			testMoveFactory.createMove('0', '2', 'X'),
			testMoveFactory.createMove('0', '1', 'O'),
			testMoveFactory.createMove('2', '2', 'X')
		];
		given = testMoveFactory.createGameEvents(moves);
		when = {
			id: '977',
			gameId: 'idsaregood',
			comm: 'PlaceMove',
			boardX: '2',
			boardY: '1',
			player: 'O',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:18:53'
		};
		then = [{
			id: '977',
			gameId: 'idsaregood',
			event: 'MovePlaced',
			boardX: '2',
			boardY: '1',
			player: 'O',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:18:53'
		},
		{
			id: '977',
			gameId: 'idsaregood',
			event: 'GameWon',
			winningPlayer: 'O',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:18:53'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should allow X to win on diagonal from 0,0 to 2,2', function () {
		var moves = [
			testMoveFactory.createMove('0', '0', 'X'),
			testMoveFactory.createMove('1', '0', 'O'),
			testMoveFactory.createMove('2', '2', 'X'),
			testMoveFactory.createMove('2', '0', 'O')
		];
		given = testMoveFactory.createGameEvents(moves);
		when = {
			id: '977',
			gameId: 'idsaregood',
			comm: 'PlaceMove',
			boardX: '1',
			boardY: '1',
			player: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:24:57'
		};
		then = [{
			id: '977',
			gameId: 'idsaregood',
			event: 'MovePlaced',
			boardX: '1',
			boardY: '1',
			player: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:24:57'
		},
		{
			id: '977',
			gameId: 'idsaregood',
			event: 'GameWon',
			winningPlayer: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:24:57'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should allow O to win on diagonal from 0,2 to 2,0', function () {
		var moves = [
			testMoveFactory.createMove('0', '0', 'X'),
			testMoveFactory.createMove('2', '0', 'O'),
			testMoveFactory.createMove('1', '0', 'X'),
			testMoveFactory.createMove('0', '2', 'O'),
			testMoveFactory.createMove('0', '1', 'X')
		];
		given = testMoveFactory.createGameEvents(moves);
		when = {
			id: '977',
			gameId: 'idsaregood',
			comm: 'PlaceMove',
			boardX: '1',
			boardY: '1',
			player: 'O',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:29:07'
		};
		then = [{
			id: '977',
			gameId: 'idsaregood',
			event: 'MovePlaced',
			boardX: '1',
			boardY: '1',
			player: 'O',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:29:07'
		},
		{
			id: '977',
			gameId: 'idsaregood',
			event: 'GameWon',
			winningPlayer: 'O',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:29:07'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should allow game to be drawn', function () {
		var moves = [
			testMoveFactory.createMove('1', '0', 'X'),
			testMoveFactory.createMove('0', '0', 'O'),
			testMoveFactory.createMove('2', '1', 'X'),
			testMoveFactory.createMove('2', '0', 'O'),
			testMoveFactory.createMove('1', '1', 'X'),
			testMoveFactory.createMove('0', '1', 'O'),
			testMoveFactory.createMove('0', '2', 'X'),
			testMoveFactory.createMove('1', '2', 'O')
		];
		given = testMoveFactory.createGameEvents(moves);
		when = {
			id: '977',
			gameId: 'idsaregood',
			comm: 'PlaceMove',
			boardX: '2',
			boardY: '2',
			player: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:41:05'
		};
		then = [{
			id: '977',
			gameId: 'idsaregood',
			event: 'MovePlaced',
			boardX: '2',
			boardY: '2',
			player: 'X',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:41:05'
		},
		{
			id: '977',
			gameId: 'idsaregood',
			event: 'GameDrawn',
			name: 'PlayingGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T17:41:05'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});
});
