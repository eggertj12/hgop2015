function user () {
	const constants = require('./constants.fluidapi')();
	
	// const state = {
	// 	'commands': [],
	// 	'nextPlayer': 'X',
	// 	'gameId': '',
	// 	'gameName': '',
	// 	'ownerName': '',
	// 	'joinerName': ''
	// }

	return function user(userName) {
		var userApi = {
			'state': {
				'command': {},
				'gameId': ''
			}, 
			'createsGame': function (gameId) {
				userApi.state.gameId = gameId;
				var command = {
					id: constants.testCmdId,
					gameId: gameId,
					comm: "CreateGame",
					userName: userName,
					name: '',
					timeStamp: constants.testTimeStamp
				};
				userApi.state.command = command;

				return userApi;
			},
			'named': function (gameName) {
				userApi.state.command.name = gameName;
				return userApi;
			},
			'joinsGame': function (gameId) {
				userApi.state.gameId = gameId;
				var command = {
					id: constants.testCmdId,
					gameId: gameId,
					comm: "JoinGame",
					name: '',
					userName: userName,
					timeStamp: constants.testTimeStamp
				};
				userApi.state.command = command;

				return userApi;
			},
			'placesMove': function (x, y) {
				var command = {
					id: constants.testCmdId,
					gameId: '',
					comm: "PlaceMove",
					boardX: x,
					boardY: y,
					player: '',
					userName: userName,
					name: '',
					timeStamp: constants.testTimeStamp
				};

				userApi.state.command = command;

				return userApi;
			},
			'getCommand': function () {
				return userApi.state.command;
			},
			'getGameId': function () {
				return userApi.state.gameId;
			},
			'getUserName': function () {
				return userName;
			},
			'clearState': function () {
				userApi.state.commands = [];
				userApi.state.gameId = '';
			}
		}
		return userApi;
	}
}

module.exports.user = user;