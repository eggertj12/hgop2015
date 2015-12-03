'use strict';
var tictactoeCommandHandler = require('./tictactoeCommandHandler');
var testMoveFactory = require('./testMoveFactory')();

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
