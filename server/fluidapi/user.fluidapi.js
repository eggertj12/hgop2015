module.exports = function () {
	const constants = require('./constants.fluidapi')();
	
	const state = {
		'commands': [],
		'nextPlayer': 'X',
		'gameId': '',
		'gameName': '',
		'ownerName': '',
		'joinerName': ''
	}
	
	return function user(userName) {
		var userApi = {
			'createsGame': function (gameId) {
				state.gameId = gameId;
				state.ownerName = userName;
				var command = {
					id: constants.testCmdId,
					gameId: gameId,
					comm: "CreateGame",
					userName: userName,
					name: '',
					timeStamp: constants.testTimeStamp
				};
				state.commands.push(command);

				return userApi;
			},
			'named': function (gameName) {
				state.gameName = gameName;
				// Assume the first command is createGame command
				try {
					state.commands[0].name = gameName;
				} catch(e) {
					console.log(e);
				}

				return userApi;
			},
			'joinsGame': function (gameId) {
				state.gameId = gameId;
				state.joinerName = userName;
				var command = {
					id: constants.testCmdId,
					gameId: gameId,
					comm: "JoinGame",
					name: state.gameName,
					userName: userName,
					timeStamp: constants.testTimeStamp
				};

				state.commands.push(command);

				return userApi;
			},
			'placesMove': function (x, y) {
				var command = {
					id: constants.testCmdId,
					gameId: state.gameId,
					comm: "PlaceMove",
					boardX: x,
					boardY: y,
					player: state.nextPlayer,
					userName: userName,
					name: state.gameName,
					timeStamp: constants.testTimeStamp
				};

				state.commands.push(command);
				state.nextPlayer = (state.nextPlayer === 'X' ? 'Y' : 'X');

				return userApi;
			},
			'getCommands': function () {
				return state.commands;
			},
			'getGameId': function () {
				return state.gameId;
			},
			'getGameName': function () {
				return state.gameName;
			},
			'getUserName': function () {
				return userName;
			},
			'getOwnerName': function () {
				return state.ownerName;
			},
			'getJoinerName': function () {
				return state.joinerName;
			},
			'getLastPlay': function () {
				return (state.nextPlayer === 'X' ? 'Y' : 'X');
			},
			'clearState': function () {
				state.commands = [];
				state.nextPlayer = 'X';
				state.gameId = '';
				state.gameName = '';
				state.userName = '';
				state.otherUserName = '';
			}
		}
		return userApi;
	}
}