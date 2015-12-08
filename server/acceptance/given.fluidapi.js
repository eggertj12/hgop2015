module.exports = function () {
	const constants = require('./constants.fluidapi')();

	const should = require('should');
	const request = require('supertest');
	const q = require('q');
	
	const acceptanceUrl = process.env.ACCEPTANCE_URL;
	
	function executeCommand(command) {
		const deferred = q.defer();
		const req = request(acceptanceUrl);
		req.post('/api/createGame')
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
		const condition = {};

		var givenAPI = {
			'expect': (event) => {
				condition.event = event;
				return givenAPI;
			},
			'withName': (gameName) => {
				condition.gameName = gameName;
				return givenAPI;
			},
			'isOk': (done) => {
				executeCommands(user.commands)
				.then(() => {
					console.log("Done");

					// Load the game history and verify that it fulfills the conditions
					request(acceptanceUrl)
						.get('/api/gameHistory/' + constants.testGameId)
						.expect(200)
						.expect('Content-Type', /json/)
						.end(function (err, res) {
							if (err) return done(err);
							res.body.should.be.instanceof(Array);
							should(res.body).eql(
								[{
									"id": constants.testCmdId,
									"gameId": constants.testGameId,
									"event": condition.event,
									"userName": user.userName,
									"name": condition.gameName,
									"timeStamp": constants.testTimeStamp
								}]);
							done();
						});
				});
				
			}
		};

		return givenAPI;
	}
}