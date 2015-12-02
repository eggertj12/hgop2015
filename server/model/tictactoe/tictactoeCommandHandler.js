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
	var buildBoard = function(events, state) {
		var counter = 0;
		events.forEach(function(event) {
			if (event.event === 'MovePlaced') {
				state.board[event.boardY][event.boardX] = event.player;
				counter ++;
				state.numberOfMoves = counter;
			}
		}, this);	
		return gameState;
	};

	/**
	 * Check if given commmand is a valid move
	 * returns event name on invalid move, undefined otherwise
	 */
	var checkMove = function(cmd, state) {
		if (state.board[cmd.boardY][cmd.boardX] !== '') {
			return 'AlreadyFilled';
		}
		if (cmd.player === 'Y' && (state.numberOfMoves % 2) === 0) {
			return 'InvalidPlayer';
		}
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
			
			var result = checkMove(cmd, gameState); 
			if (result !== undefined) {
				return [{
					id: cmd.id,
					event: result,
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