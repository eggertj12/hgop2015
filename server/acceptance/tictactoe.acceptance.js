'use strict';

const should = require('should');
const request = require('supertest');
const acceptanceUrl = process.env.ACCEPTANCE_URL;

const user = require('./user.fluidapi.js')();
const given = require('./given.fluidapi.js')();
const constants = require('./constants.fluidapi')();

describe('TEST ENV GET /api/gameHistory', function () {

  it('Should have ACCEPTANCE_URL environment variable exported.', function () {
    acceptanceUrl.should.be.ok;
  });
});

describe('TicTacToe API', function () {
  it('should execute create game using old style', function (done) {

    var command = {
      id: "1234",
      gameId: "999",
      comm: "CreateGame",
      userName: "Gulli",
      name: "TheFirstGame",
      timeStamp: "2014-12-02T11:29:29"
    };

    var req = request(acceptanceUrl);
    req
      .post('/api/createGame')
      .type('json')
      .send(command)
      .end(function (err, res) {
        if (err) return done(err);
        request(acceptanceUrl)
          .get('/api/gameHistory/999')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            should(res.body).eql(
              [{
                "id": "1234",
                "gameId": "999",
                "event": "GameCreated",
                "userName": "Gulli",
                "name": "TheFirstGame",
                "timeStamp": "2014-12-02T11:29:29"
              }]);
            done();
          });
      });
  });


  it('Should execute fluid API test for Create game', function (done) {
    user().clearState();
    given(user("YourUser").createsGame('GameId1').named("TheFirstGame"))
    .expect("GameCreated").withName("TheFirstGame").isOk(done);
  });

  it('Should allow user to join a game', function (done) {
    user().clearState();
    given(user("YourUser").createsGame('GameId2').named('TheSecondGame'))
    .and(user("OtherUser").joinsGame('GameId2'))
    .expect("GameJoined").withName("TheSecondGame").isOk(done);
  });

  it('Should get a drawn game if no winner', function (done) {
    user().clearState();
    given(user("YourUser").createsGame('GameId3').named('TheThirdGame'))
    .and(user("OtherUser").joinsGame('GameId3'))
    .and(user("YourUser").placesMove('1', '0'))
    .and(user("OtherUser").placesMove('0', '0'))
    .and(user("YourUser").placesMove('2', '1'))
    .and(user("OtherUser").placesMove('2', '0'))
    .and(user("YourUser").placesMove('1', '1'))
    .and(user("OtherUser").placesMove('0', '1'))
    .and(user("YourUser").placesMove('0', '2'))
    .and(user("OtherUser").placesMove('1', '2'))
    .and(user("YourUser").placesMove('2', '2'))
    .expect("GameDrawn").withName("TheThirdGame").isOk(done);
  });

  it('Should allow X to win a game on column', function (done) {
    user().clearState();
    given(user("YourUser").createsGame('GameId4').named('TheWinningGame'))
    .and(user("OtherUser").joinsGame('GameId4'))
    .and(user("YourUser").placesMove('1', '0'))
    .and(user("OtherUser").placesMove('0', '0'))
    .and(user("YourUser").placesMove('1', '1'))
    .and(user("OtherUser").placesMove('0', '1'))
    .and(user("YourUser").placesMove('1', '2'))
    .expect("GameWon").withWinner("YourUser").isOk(done);
  });

});
