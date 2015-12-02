# Event sourcing test examples for Tic Tac Toe

## Commands and events

The valid commands and their corresponding events are

  * CreateGame - GameCreated
  * JoinGame – GameJoined
  * Place – Placed, GameWon, GameDrawn

Then there are notifications for illegal moves

  * GameNotFound
  * GameFull
  * IllegalMove
  * IllegalPlayer

## Start game

Given []
When  [CreateGame()]
Then  [GameCreated()]

## Join game

Given [GameCreated(), GameJoined()]
When  [JoinGame()]
Then  [Notify(GameFull)]

Given [GameCreated()]
When  [JoinGame()]
Then  [GameJoined(Y)]

## Illegal play

Given [Placed(a,b,X)]
When  [Place(a,b,X)]
Then  [Notify(IllegalMove)]

Given [odd(count(Placed()))]
When  [Place(a,b,X)]
Then  [Notify(IllegalPlayer)]

Given [even(count(Placed()))]
When  [Place(a,b,Y)]
Then  [Notify(IllegalPlayer)]

## Win game

Given [Placed(a,0,X), Placed(a,1,X)]
When  [Place(a,2,X)]
Then  [Placed(a,2,X), GameWon(X)]

Given [Placed(0,a,X), Placed(1,a,X)]
When  [Place(2,a,X)]
Then  [Placed(2,a,X), GameWon(X)]

Given [Placed(0,0,X), Placed(1,1,X)]
When  [Place(2,2,X)]
Then  [Placed(2,2,X), GameWon(X)]

Given [Placed(2,0,X), Placed(1,1,X)]
When  [Place(0,2,X)]
Then  [Placed(0,2,X), GameWon(X)]

## Draw game

Given [count(Placed()) == 8]
When  [Place(a,b,X)]
Then  [Placed(a,b,X), GameDrawn()]

## Normal play

Given []
When  [Place(a,b,X)]
Then  [Placed(a,b,X)]
