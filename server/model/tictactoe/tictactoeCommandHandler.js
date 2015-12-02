module.exports = function tictactoeCommandHandler(events) {
	'use strict';
	var gameCreatedEvent = events[0];

	var handlers = {
		'CreateGame': function (cmd) {
			return [{
				id: cmd.id,
				event: 'GameCreated',
				gameName: cmd.gameName,
				userName: cmd.userName,
				timeStamp: cmd.timeStamp
			}];
		},

		'JoinGame': function (cmd) {
			if (gameCreatedEvent === undefined) {
				return [{
					id: cmd.id,
					event: 'GameNotFound',
					gameName: cmd.gameName,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				}];
			}
			return [{
				id: cmd.id,
				event: 'GameJoined',
				gameName: cmd.gameName,
				userName: cmd.userName,
				otherUserName: gameCreatedEvent.userName,
				timeStamp: cmd.timeStamp
			}];
		},

		'PlaceMove': function (cmd) {
			return [{
				id: cmd.id,
				event: 'GameNotFound',
				gameName: cmd.gameName,
				userName: cmd.userName,
				timeStamp: cmd.timeStamp
			}];
		}
	};

	return {
		executeCommand: function (cmd) {
			return handlers[cmd.command](cmd);
		}
	};
};