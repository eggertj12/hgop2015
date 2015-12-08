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
				gameId: cmd.gameId,
				event: 'GameCreated',
				name: cmd.name,
				userName: cmd.userName,
				player: 'X',
				timeStamp: cmd.timeStamp
			}];
		},

		'JoinGame': function (cmd) {
			if (gameCreatedEvent === undefined) {
				return [{
					id: cmd.id,
					gameId: cmd.gameId,
					event: 'GameNotFound',
					name: cmd.name,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				}];
			}
			if (gameJoinedEvent !== undefined) {
				return [{
					id: cmd.id,
					gameId: cmd.gameId,
					event: 'GameFull',
					name: cmd.name,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				}];
			}
			return [{
				id: cmd.id,
				gameId: cmd.gameId,
				event: 'GameJoined',
				name: cmd.name,
				userName: cmd.userName,
				player: 'O',
				otherUserName: gameCreatedEvent.userName,
				timeStamp: cmd.timeStamp
			}];
		},

		'PlaceMove': function (cmd) {
			
			// First check for valid game
			if (gameCreatedEvent === undefined) {
				return [{
					id: cmd.id,
					gameId: cmd.gameId,
					event: 'GameNotFound',
					name: cmd.name,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				}];
			}

			if (gameJoinedEvent === undefined) {
				return [{
					id: cmd.id,
					gameId: cmd.gameId,
					event: 'GameNotReady',
					name: cmd.name,
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
					gameId: cmd.gameId,
					event: result,
					name: cmd.name,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				}];
			}
			
			// Place move on board
			state.placeMove(cmd.boardX, cmd.boardY, cmd.player);
			var placedEvent = {
				id: cmd.id,
				gameId: cmd.gameId,
				event: 'MovePlaced',
				boardX: cmd.boardX,
				boardY: cmd.boardY,
				player: cmd.player,
				name: cmd.name,
				userName: cmd.userName,
				timeStamp: cmd.timeStamp
			}; 

			// Check for winning
			result = state.gameWon();
			if (result !== undefined) {
				var wonEvent = {
					id: cmd.id,
					gameId: cmd.gameId,
					event: 'GameWon',
					winningPlayer: result,
					name: cmd.name,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				};

				return [placedEvent, wonEvent];
			}
			
			// Finally check for draw
			if (state.gameDrawn()) {
				var drawnEvent = {
					id: cmd.id,
					gameId: cmd.gameId,
					event: 'GameDrawn',
					name: cmd.name,
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
			return handlers[cmd.comm](cmd);
		}
	};
};