function given () {
	const constants = require('./constants.fluidapi')();

	const should = require('should');
	const request = require('supertest');
	const q = require('q');
	
	const acceptanceUrl = process.env.ACCEPTANCE_URL;
	
	// ------------------------------------------------
	// Helper functions
	// ------------------------------------------------
	
	// Wrap a single command in a promise and execute it
	function executeCommand(command) {
		const deferred = q.defer();
		const req = request(acceptanceUrl);
		req.post('/api/' + command.comm)
			.type('json')
			.send(command)
			.end((err, res) => {
				if (err) {
					console.log('Error posting commmand "' + command.comm + '": ', err);
					deferred.reject(err);
				}
				deferred.resolve(res);
			});
		return deferred.promise;
	}
	
	// Takes a list of commands and executes them sequentially
	function executeCommands(commands) {
		return commands.reduce(function(promise, command) {
			return promise.then(function(result) {
				return executeCommand(command, result);
			});        
		}, q());		
	}

	// ------------------------------------------------
	// Actual API function
	// ------------------------------------------------

	return function given(user) {

		var givenAPI = {
			'condition': {
				'event': '',
				'gameId': user.getCommand().gameId,
				'gameName': user.getCommand().name,
				'winnerName': ''
			}, 
			'commands': [user.getCommand()],
			'state': {
				'gameId': user.getCommand().gameId,
				'ownerName': user.getUserName(),
				'gameName': user.getCommand().name,
				'currentUser': user,
				'nextPlayer': 'X'
			},
			'and': function (user) {
				givenAPI.state.currentUser = user;
				
				const newCommand = user.getCommand();
				
				if (user.getCommand().comm === 'JoinGame') {
					newCommand.name = givenAPI.state.gameName;

					givenAPI.state.joinerName = user.getUserName();
				}

				if (user.getCommand().comm === 'PlaceMove') {
					newCommand.gameId = givenAPI.state.gameId;
					newCommand.name = givenAPI.state.gameName;
					newCommand.player = givenAPI.state.nextPlayer;

					givenAPI.state.nextPlayer = (givenAPI.state.nextPlayer === 'X' ? 'Y' : 'X');
				}

				givenAPI.commands.push(newCommand);
				return givenAPI;
			},
			'expect': function (event) {
				givenAPI.condition.event = event;
				return givenAPI;
			},
			'withName': function (gameName)  {
				givenAPI.condition.gameName = gameName;
				return givenAPI;
			},
			'withWinner': function (userName)  {
				givenAPI.condition.winnerName = userName;
				return givenAPI;
			},
			'isOk': (done) => {
				const expectedEvent = {
					"id": constants.testCmdId,
					"gameId": givenAPI.state.gameId,
					"event": givenAPI.condition.event,
					"userName": givenAPI.state.currentUser.getUserName(),
					"name": givenAPI.condition.gameName,
					"timeStamp": constants.testTimeStamp
				};
				
				if (givenAPI.condition.event === 'GameCreated') {
					expectedEvent.player = 'X'
				} 

				if (givenAPI.condition.event === 'GameJoined') {
					expectedEvent.userName = givenAPI.state.joinerName;
					expectedEvent.otherUserName = givenAPI.state.ownerName;
					expectedEvent.player = 'O'
				} 

				if (givenAPI.condition.event === 'GameWon') {
					expectedEvent.winningPlayer = (givenAPI.state.nextPlayer === 'X' ? 'Y' : 'X');
				} 

				executeCommands(givenAPI.commands)
				.then(() => {

					// Load the game history and verify that it fulfills the conditions
					request(acceptanceUrl)
						.get('/api/gameHistory/' + givenAPI.state.gameId)
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

module.exports.given = given;