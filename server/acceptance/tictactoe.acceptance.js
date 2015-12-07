'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;

// Set up fluid API for testing
// Some test data
const testCmdId = '23456';
const testGameId = '98765';
const testTimeStamp = Date.now();
function user(userName) {
  return {
    'createsGame': function (gameName) {
      var command = {
        id: testCmdId,
        gameId: testGameId,
        comm: "CreateGame",
        userName: userName,
        name: gameName,
        timeStamp: testTimeStamp
      };

      return command;
    }
  };
}

function given(command) {
  const condition = {};

  var givenAPI = {
    'expect': (event) => {
      condition.event = event;
      return givenAPI;
    },
    'withName': (gameName) => {
      condition.gameName = gameName;
      return givenAPI;
    },
    'isOk': (done) => {
      // Execute command
      var req = request(acceptanceUrl);
      req
        .post('/api/createGame')
        .type('json')
        .send(command)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          // Load the game history and verify that it fulfills the conditions
          request(acceptanceUrl)
            .get('/api/gameHistory/' + testGameId)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
              if (err) return done(err);
              res.body.should.be.instanceof(Array);
              should(res.body).eql(
                [{
                  "id": testCmdId,
                  "gameId": testGameId,
                  "event": condition.event,
                  "userName": command.userName,
                  "name": condition.gameName,
                  "timeStamp": testTimeStamp
                }]);
              done();
            });

        });
    }
  };

  return givenAPI;
}

describe('TEST ENV GET /api/gameHistory', function () {

  it('Should have ACCEPTANCE_URL environment variable exported.', function () {
    acceptanceUrl.should.be.ok;
  });

  it('should execute same test using old style', function (done) {

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


  it('Should execute fluid API test', function (done) {
    given(user("YourUser").createsGame("TheFirstGame"))
    .expect("GameCreated").withName("TheFirstGame").isOk(done);
  });

});
