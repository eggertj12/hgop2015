module.exports = function () {
	const constants = require('./constants.fluidapi')();
	
	return function user(userName) {
		var userApi = {
			'commands': [],
			'userName': userName,
			'createsGame': function (gameName) {
				var command = {
					id: constants.testCmdId,
					gameId: constants.testGameId,
					comm: "CreateGame",
					userName: userName,
					name: gameName,
					timeStamp: constants.testTimeStamp
				};

				userApi.commands.push(command);

				return userApi;
			}
		}
		return userApi;
	}
}