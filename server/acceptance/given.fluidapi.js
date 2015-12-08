module.exports = function () {
	const constants = require('./constants.fluidapi')();

	var should = require('should');
	var request = require('supertest');
	var acceptanceUrl = process.env.ACCEPTANCE_URL;

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
				// Execute command
				var req = request(acceptanceUrl);
				req
					.post('/api/createGame')
					.type('json')
					.send(user.commands[0])
					.end((err, res) => {
						if (err) {
							return done(err);
						}

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