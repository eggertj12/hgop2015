module.exports = function tictactoeCommandHandler(events) {
	'use strict';
	var gameCreatedEvent = events[0];
	var gameJoinedEvent = events[1];
	var gameState = {
		board: [
			['', '', ''],
			['', '', ''],
			['', '', '']
		],
		nextPlayer: 'X',
		numberOfMoves: 0
	}
	
	/**
	 * Build the board status from event collection
	 */
	var buildBoard = function(events, gameState) {
		events.forEach(function(event) {
			if (event.event === 'MovePlaced') {
				gameState.board[event.boardY][event.boardX] = event.player;
			}
		}, this);	
		return gameState;
	};

	/**
	 * Check if given commmand is a valid move
	 * returns false on invalid move, true otherwise
	 */
	var checkMove = function(cmd, state) {
		if (state.board[cmd.boardY][cmd.boardX] !== '') {
			return false;
		}
		return true;
	};

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
			
			gameState = buildBoard(events, gameState);
			
			if (!checkMove(cmd, gameState)) {
				return [{
					id: cmd.id,
					event: 'IllegalMove',
					gameName: cmd.gameName,
					userName: cmd.userName,
					timeStamp: cmd.timeStamp
				}];
			}
			
			return [{
				id: cmd.id,
				event: 'MovePlaced',
				boardX: cmd.boardX,
				boardY: cmd.boardY,
				player: cmd.player,
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