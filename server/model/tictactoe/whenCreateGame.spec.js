'use strict';
var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('create game command', function(){
	var given, when, then;
	
	it('should create game', function() {
		given = [];
		when = {
			id: '1234',
			command:'CreateGame',
			gameName: 'FirstGame',
			userName : 'Gulli',
			timeStamp: '2015.12.02T11:29:44'
		};
		then = [{
			id: '1234',
			event:'GameCreated',
			gameName : 'FirstGame',
			userName : 'Gulli',
			timeStamp: '2015.12.02T11:29:44'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should create another game for another user', function() {
		given = [];
		when = {
			id: '9876',
			command:'CreateGame',
			gameName: 'MyGame',
			userName : 'Eggert',
			timeStamp: '2015.12.02T14:41:12'
		};
		then = [{
			id: '9876',
			event:'GameCreated',
			gameName : 'MyGame',
			userName : 'Eggert',
			timeStamp: '2015.12.02T14:41:12'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});
});

describe('join game command', function(){
	var given, when, then;
	
	it('should join game', function() {
		given = [{
			id: '1234',
			event:'GameCreated',
			userName : 'Gulli',
			gameName : 'FirstGame',
			timeStamp: '2015.12.02T11:29:44'
		}];
		when = {
			id: '1238',
			command:'JoinGame',
			gameName: 'FirstGame',
			userName : 'Eggert',
			timeStamp: '2015.12.02T11:30:14'
		};
		then = [{
			id: '1238',
			event:'GameJoined',
			gameName: 'FirstGame',
			userName : 'Eggert',
			otherUserName : 'Gulli',
			timeStamp: '2015.12.02T11:30:14'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not join game if no game started', function() {
		given = [];
		when = {
			id: '5432',
			command:'JoinGame',
			gameName: 'FirstGame',
			userName : 'Eggert',
			timeStamp: '2015.12.02T15:30:54'
		};
		then = [{
			id: '5432',
			event:'GameNotFound',
			gameName: 'FirstGame',
			userName : 'Eggert',
			timeStamp: '2015.12.02T15:30:54'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});
});

describe('place move command', function(){
	var given, when, then;
	
	it('should not place move if no game started', function() {
		given = [];
		when = {
			id: '7483',
			command:'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'X',
			gameName: 'FirstGame',
			userName : 'Eggert',
			timeStamp: '2015.12.02T15:36:00'
		};
		then = [{
			id: '7483',
			event:'GameNotFound',
			gameName: 'FirstGame',
			userName : 'Eggert',
			timeStamp: '2015.12.02T15:36:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

	it('should not place move if game not full', function() {
		given = [{
			id: '5374',
			event:'GameCreated',
			userName : 'Freyja',
			gameName : 'SomeGame',
			timeStamp: '2015.12.02T09:29:44'
		}];
		when = {
			id: '7483',
			command:'PlaceMove',
			boardX: '0',
			boardY: '0',
			player: 'X',
			gameName: 'SomeGame',
			userName : 'Eggert',
			timeStamp: '2015.12.02T09:36:00'
		};
		then = [{
			id: '7483',
			event:'GameNotReady',
			gameName: 'SomeGame',
			userName : 'Eggert',
			timeStamp: '2015.12.02T09:36:00'
		}];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});

});


/*
describe('join game command', function(){
	var given, when, then;
	
	it('should not join game if no game started', function() {
		given = [];
		when = {
		};
		then = [];

		var actualEvents = tictactoeCommandHandler(given).executeCommand(when);
		JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
	});
});
*/