module.exports = function testMoveFactory () {
	return {
		/**
		* Create a move for test setup
		*/
		'createMove': function (x, y, player) {
			return {
				boardX : x,
				boardY : y,
				player : player
			}
		},
		
		/**
		* Create an array of Events base on moves
		*/
		'createGameEvents': function (moves) {
			var events = [];
			var counter = 1;
		
			events.push({
				id: '1',
				gameId: 'idsaregood',
				event: 'GameCreated',
				gameName: 'TestGame',
				userName: 'Player1',
				timeStamp: '2015.12.02T15:32:00'
			});
		
			events.push({
				id: '2',
				gameId: 'idsaregood',
				event: 'GameJoined',
				gameName: 'TestGame',
				userName: 'Player2',
				otherUserName: 'Player1',
				timeStamp: '2015.12.02T15:32:30'
			});
		
			moves.forEach(function(move) {
				events.push({
					id: counter + 2 + '',
					gameId: 'idsaregood',
					event: 'MovePlaced',
					boardX: move.boardX,
					boardY: move.boardY,
					player: move.player,
					gameName: 'TestGame',
					userName: (counter % 2 === 1 ? 'Player1' : 'Player2'),
					timeStamp: '2015.12.02T15:00:' + (counter + 10)
				});
				counter++;
			});
		
			return events;
		}		
	}
}