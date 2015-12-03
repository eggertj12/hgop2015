function tictactoeState() {

	var state = {
		board: [
			['', '', ''],
			['', '', ''],
			['', '', '']
		],
		nextPlayer: 'X',
		numberOfMoves: 0
	}

	return {
		/**
		 * Build the board status from event collection
		 */
		'buildState': function (events) {
			var counter = 0;
			events.forEach(function (event) {
				if (event.event === 'MovePlaced') {
					state.board[event.boardY][event.boardX] = event.player;
					counter++;
					state.numberOfMoves = counter;
				}
			}, this);
		},
		
		/**
		 * Place a move on the board
		 */
		'placeMove': function (x, y, player) {
			state.board[y][x] = player;
			state.numberOfMoves++;
		},
		
		/**
		 * Check if given commmand is a valid move
		 * returns event name on invalid move, undefined otherwise
		 */
		'checkMove': function(x, y, player) {
			if (state.board[y][x] !== '') {
				return 'AlreadyFilled';
			}
			if (player === 'X' && (state.numberOfMoves % 2) === 1) {
				return 'InvalidPlayer';
			}
			if (player === 'O' && (state.numberOfMoves % 2) === 0) {
				return 'InvalidPlayer';
			}
		},
		
		/**
		 * Check if game is won
		 * Returns the winning player if won, undefined otherwise
		 */
		'gameWon': function() {
			// Check for winning column
			for (var i = 0; i < 3; i++) {
				var colFirst = state.board[0][i];
				if (colFirst !== '' && (colFirst === state.board[1][i]) && (colFirst === state.board[2][i])) {
					return colFirst;
				}
			}
	
			// Check for winning row
			for (var i = 0; i < 3; i++) {
				var rowFirst = state.board[i][0];
				if (rowFirst !== '' && (rowFirst === state.board[i][1]) && (rowFirst === state.board[i][2])) {
					return rowFirst;
				}
			}
	
			// Check for winning diagonal 0,0 to 2,2
			var diagFirst = state.board[0][0];
			if (diagFirst !== '' && (diagFirst === state.board[1][1]) && (diagFirst === state.board[2][2])) {
				return diagFirst;
			}
	
			// Check for winning diagonal 0,2 to 2,0
			var diagFirst = state.board[0][2];
			if (diagFirst !== '' && (diagFirst === state.board[1][1]) && (diagFirst === state.board[2][0])) {
				return diagFirst;
			}
		},
		/**
		 * Check if game is a draw
		 * Returns boolean draw or not
		 */
		'gameDrawn': function() {
			return state.numberOfMoves === 9;
		}
	}
}

module.exports = function tictactoeCommandHandler(events) {
	'use strict';
	var gameCreatedEvent = events[0];
	var gameJoinedEvent = events[1];
	var state = tictactoeState();
	
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