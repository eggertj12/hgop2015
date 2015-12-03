module.exports = function tictactoeCommandHandler(events) {
	'use strict';
	var tictactoeState = require('./tictactoeState');
	var state = tictactoeState();

	var gameCreatedEvent = events[0];
	var gameJoinedEvent = events[1];
	
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
			if (gameJoinedEvent !== undefined) {
				return [{
					id: cmd.id,
					event: 'GameFull',
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
			
			// First check for valid game
			if (gameCreatedEvent === undefined) {
				return [{
					id: cmd.id,
					event: 'GameNotFound',
					gameName: cmd.gameName,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				}];
			}

			if (gameJoinedEvent === undefined) {
				return [{
					id: cmd.id,
					event: 'GameNotReady',
					gameName: cmd.gameName,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				}];
			}
			
			// Game is valid, create state
			state.buildState(events);
			
			// Check for valid move
			var result = state.checkMove(cmd.boardX, cmd.boardY, cmd.player);
			if (result !== undefined) {
				return [{
					id: cmd.id,
					event: result,
					gameName: cmd.gameName,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				}];
			}
			
			// Place move on board
			state.placeMove(cmd.boardX, cmd.boardY, cmd.player);
			var placedEvent = {
				id: cmd.id,
				event: 'MovePlaced',
				boardX: cmd.boardX,
				boardY: cmd.boardY,
				player: cmd.player,
				gameName: cmd.gameName,
				userName: cmd.userName,
				timeStamp: cmd.timeStamp
			}; 

			// Check for winning
			result = state.gameWon();
			if (result !== undefined) {
				var wonEvent = {
					id: cmd.id,
					event: 'GameWon',
					winningPlayer: result,
					gameName: cmd.gameName,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				};

				return [placedEvent, wonEvent];
			}
			
			// Finally check for draw
			if (state.gameDrawn()) {
				var drawnEvent = {
					id: cmd.id,
					event: 'GameDrawn',
					gameName: cmd.gameName,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				};

				return [placedEvent, drawnEvent];
			}
			
			// No fail or end condition true. Just place the move.
			return [placedEvent];
		}
	};

	return {
		executeCommand: function (cmd) {
			return handlers[cmd.command](cmd);
		}
	};
};