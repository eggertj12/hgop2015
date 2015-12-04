module.exports = function tictactoeState() {
	'use strict';
	
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
			});
		},
		
		/**
		 * Place a move on the board
		 */
		'placeMove': function (x, y, player) {
			state.board[y][x] = player;
			state.numberOfMoves++;
		},
		
		/**
		 * Check if given command is a valid move
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
			for (i = 0; i < 3; i++) {
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
			diagFirst = state.board[0][2];
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
