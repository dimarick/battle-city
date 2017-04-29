JavaScript Battle City game implementation
------------------------------------------

Running:
-------

```
npm install
npm run build
```

And open index.html in your browser (webkit is preferred, it does guarantee maximum performance)

Control:
-------

*Player 1*: `wasd` for moving, `space` for fire

*Player 2*: `↑←↓→` for moving, `num0` for fire

*Common*: `Pause/Break` for pause game

Roadmap
-------

1. Core
    1. Improve collision engine: 
        1. calculate real collision time in time intervals 
        2. find first collision in interval (currently only check collisions at interval end)
    2. Fix bug with incorrect moving enemy tank(only allowed 8px grid)
    3. Improve accuracy on rotation enemy tanks: use map data to detect allowed rotations, do not change anything before valid direction will be selected 
    4. Fix bug with game reload after gameover: next gameover will not work
    5. Player spawner incorrectly attach keyboard after some respawn: needs re-press control buttons if it already pressed before birth
    6. Handle ice block type
    7. Add sounds
    8. Decompose Scene object
    9. Add tests!
    
2. Gameplay:
    1. Create bonuses
    2. Show scores after enemy destroy
    3. Create stage subsystem
    4. Add start screen and ability to select one or two players
    5. Add stage enter screen
    6. Add scores summary screen after stage
    7. Add high-score congratulation screen
    8. Improve enemy AI: add common strategy, add tactic rules.
    
3. Multiplayer
    1. Provide serialization/deserialization for each game object
    2. Provide identity for each game object and way to lookup object by id
    3. Allow run game on server
    4. Create communication using websockets between client and server
    5. Allow push state from server to client
    6. Create large scene, optimize scene rendering
    7. Create MP balanced gameplay
    8. Create ratings server
    