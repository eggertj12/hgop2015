var user = require('../fluidapi/user.fluidapi.js').user;
var given = require('../fluidapi/given.fluidapi.js').given;

it('Should play 1 games in x seconds.', function (done) {
  var doneCount = 0;
  var gamesToPlay = 1;
  var x = 6;

  this.timeout(x * 1000);

  var QED = function () {
    if (gamesToPlay === ++doneCount) {
      done();
    }
  };

  for (var gameId = 0; gameId < gamesToPlay; gameId++) {
    user().clearState();
    given(user("YourUser").createsGame('Game' + gameId).named('TestGameNumber-' + gameId))
    .and(user("OtherUser").joinsGame('Game' + gameId))
    .and(user("YourUser").placesMove('1', '0'))
    .and(user("OtherUser").placesMove('0', '0'))
    .and(user("YourUser").placesMove('2', '1'))
    .and(user("OtherUser").placesMove('2', '0'))
    .and(user("YourUser").placesMove('1', '1'))
    .and(user("OtherUser").placesMove('0', '1'))
    .and(user("YourUser").placesMove('0', '2'))
    .and(user("OtherUser").placesMove('1', '2'))
    .and(user("YourUser").placesMove('2', '2'))
    .expect("GameDrawn").withName('TestGameNumber-' + gameId).isOk(QED);
  }
});
