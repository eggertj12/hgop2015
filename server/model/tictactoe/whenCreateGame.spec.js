'use strict';
var tictactoeCommandHandler = require('./tictactoeCommandHandler');
var testMoveFactory = require('./testMoveFactory')();

describe('create game command', function () {
	var given, when, then;

	it('should create game', function () {
		given = [];
		when = {
			id: '1234',
			gameId: 'abcd',
			command: 'CreateGame',
			gameName: 'FirstGame',
			userName: 'Gulli',
			timeStamp: '2015.12.02T11:29:44'
		};
		then = [{
			id: '1234',
			gameId: 'abcd',
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
			gameId: 'abcd',
			command: 'CreateGame',
			gameName: 'MyGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T14:41:12'
		};
		then = [{
			id: '9876',
			gameId: 'abcd',
			event: 'GameCreated',
			gameName: 'MyGame',
			userName: 'Eggert',
			timeStamp: '2015.12.02T14:41:12'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});
});

