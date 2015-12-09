module.exports = function () {
	const constants = require('./constants.fluidapi')();

	const should = require('should');
	const request = require('supertest');
	const q = require('q');
	
	const acceptanceUrl = process.env.ACCEPTANCE_URL;
	
	function executeCommand(command) {
		const deferred = q.defer();
		const req = request(acceptanceUrl);
		req.post('/api/' + command.comm)
			.type('json')
			.send(command)
			.end((err, res) => {
				if (err) {
					deferred.reject(err);
				}
				deferred.resolve(res);
			});
		return deferred.promise;
	}
	
	function executeCommands(commands) {
		return commands.reduce(function(promise, command) {
			return promise.then(function(result) {
				return executeCommand(command, result);
			});        
		}, q());		
	}

	return function given(user) {
		const condition = {
			'event': '',
			'gameId': user.getGameId(),
			'gameName': user.getGameName(),
			'winnerName': ''
		};
		var commands = user.getCommands();
		var currentUser = user;

		var givenAPI = {
			'and': function (user) {
				commands = user.getCommands();
				currentUser = user;
				return givenAPI;
			},
			'expect': function (event) {
				condition.event = event;
				return givenAPI;
			},
			'withName': function (gameName)  {
				condition.gameName = gameName;
				return givenAPI;
			},
			'withWinner': function (userName)  {
				condition.winnerName = userName;
				return givenAPI;
			},
			'isOk': (done) => {
				const expectedEvent = {
					"id": constants.testCmdId,
					"gameId": currentUser.getGameId(),
					"event": condition.event,
					"userName": user.getUserName(),
					"name": condition.gameName,
					"timeStamp": constants.testTimeStamp
				};
				
				if (condition.event === 'GameJoined') {
					expectedEvent.userName = currentUser.getJoinerName();
					expectedEvent.otherUserName = currentUser.getOwnerName();
				} 

				if (condition.event === 'GameWon') {
					expectedEvent.winningPlayer = currentUser.getLastPlay();
				} 

				executeCommands(commands)
				.then(() => {

					// Load the game history and verify that it fulfills the conditions
					request(acceptanceUrl)
						.get('/api/gameHistory/' + user.getGameId())
						.expect(200)
						.expect('Content-Type', /json/)
						.end(function (err, res) {
							if (err) return done(err);
							res.body.should.be.instanceof(Array);
							should(res.body.pop()).eql(expectedEvent);
							done();
						});
				});
				
			}
		};

		return givenAPI;
	}
}