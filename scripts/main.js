// game goes up to level 10 and then stops increasing levels
// The only difference is speed
let maxLevel = 10;
// Time to wait for next screen update
let timeToWait = 0.3; // seconds
// Register for remembering last iteration
let timeRegister;
// Time in milisseconds of when player movemment was blocked
let playerBlockedTime;

// Game basic draws board, score, and coordinates passed
let gameBasic = new GameBasic(12, 20, maxLevel)
// Snake keeps track of the head and body positions
let snake = new Snake( 1, 10 )
// Food location (not initialized)
let food = new Point( )

// Possible states for our game
const states = { NONE: 0, PLAYING: 1, NEXT_LEVEL: 2, GAME_OVER: 3 };
// Game starts as playable
let gameState = states.PLAYING;

// Set focus to game
this.focus( );

function setup( ) {
    
    // GameBasic handles the size of the game for us
    gameBasic.updateWidthHeight( );
    // Create canvas based on dimensions found
    createCanvas( gameBasic.width, gameBasic.height );
    // Backgound is composed of score and green rectangle
    gameBasic.drawBackground( );
    // We don't need fancy animations. So set to 20 fps
    frameRate( maxLevel * 2 );
    // Place food randomly
    newFood( );
    // Ready time
    timeRegister = millis( );
}

function draw( ) {
    // Time since last iteration
    let elipsedTime = ( millis( ) - timeRegister ) / 1000;
    
    // Do not update if its not time for it
    if( elipsedTime > timeToWait )
        timeRegister = millis( );
    else
        return
    
    // Draws background
    gameBasic.drawBackground( );
    
    // If state is 'Playing', update position when check things
    if( gameState == states.PLAYING ) {
        checkFoodCaught( );
        snake.updatePosition( );
        checkBoundaries( );
    } else {
        // If not, let pass some seconds before game over or next level
        // screen is blinking here
        let elapsedTime = ( millis( ) - playerBlockedTime ) / 1000;
        if( gameState == states.NEXT_LEVEL && elapsedTime > 1 )
            nextLevel( );
        if( gameState == states.GAME_OVER  && elapsedTime > 3 )
            restartGame( );
    }
    
    // When hitting, snake head goes outside the game, so e gonna hide it
    if( gameBasic.isInsideGame( snake.head ) )
        gameBasic.drawCell( snake.head );
    // Draw snake's body
    for( let cell of snake.tail )
        gameBasic.drawCell( cell );
    // Draw food
    gameBasic.drawCell( food, 1 );
}

function windowResized( ) {
    // Called everytime the window is resized
    gameBasic.updateWidthHeight( );
    resizeCanvas( gameBasic.width, gameBasic.height );
    redraw( );
}

function touchStarted( ) {
    // Mouse and touch inputs
    // Ignore command on game over and next_level
    if( gameState != states.PLAYING )
        return
    
    // Split screen in half. If snake is walking horizontally, use top and bottom
    if( snake.lastDirection == dir.LEFT || snake.lastDirection == dir.RIGHT ) {
        if( mouseY < gameBasic.height / 2 )
            snake.command( dir.UP );
        else
            snake.command( dir.DOWN );
    } else {
        // If snake is walking vertically, use left and right
        if( mouseX < gameBasic.width / 2 )
            snake.command( dir.LEFT );
        else
            snake.command( dir.RIGHT );
    }
    return false;
}

function keyPressed( ) {
    // Key board input
    if( gameState != states.PLAYING )
        return
    
    // "dir" structure is defined under snake.js
    if( keyCode == LEFT_ARROW )
        snake.command( dir.LEFT );
    else if( keyCode == RIGHT_ARROW )
        snake.command( dir.RIGHT );
    else if( keyCode == UP_ARROW )
        snake.command( dir.UP );
    else if( keyCode == DOWN_ARROW )
        snake.command( dir.DOWN );
}

function checkBoundaries( ) {
    // Check if snake is hitting walls or its own body
    if( !gameBasic.isInsideGame( snake.head ) || snake.isPointInside( snake.head ) ) 
        pauseEvent( states.GAME_OVER );
}

function checkFoodCaught( ) {
    // Checks if snake head is over food
    if( snake.head.isEqualTo( food ) ) {
        // If yes, eat it and icrease score
        snake.eat( food );
        gameBasic.incScore( );
        
        // Increase level at each 150 points
        if( gameBasic.score % 150  == 0 ) {
            let allow = gameBasic.incLevel( );
            // If maximum level is not reached, call next level
            if( allow )
                pauseEvent( states.NEXT_LEVEL );
        } else {
            // If did not pass level, just update food position
            // Food is replaced if falls below snake
            do
                newFood( );
            while( snake.isPointInside( food ) );
        }
    }
}

function pauseEvent( state = states.NONE ) {
    // If argument was passed, update state
    if( state != states.NONE )
        gameState = state;
    
    if( gameState == states.PLAYING ) {
        // If state is normal, do not blink
        gameBasic.blinkScreen = false;
        gameBasic.blinkScore = false;
    } else if ( gameState == states.NEXT_LEVEL ) {
        // If next_level, set score blink and frequency
        timeToWait = 0.3;
        gameBasic.blinkScore = true;
        playerBlockedTime = millis( );
    } else if ( gameState == states.GAME_OVER ) {
        // If next_level, set game blink and frequency
        timeToWait = 0.3;
        gameBasic.blinkScreen = true;
        playerBlockedTime = millis( );
    }
}

function newFood( ) {
    // place food randomly
    food.randomPoint( 0, 1, gameBasic.xCells - 1, gameBasic.yCells );
}

function restartGame( ) {
    // Reset scoring, create new snake,
    // set to normal state and initial wait time
    gameBasic.resetScore( );
    snake = new Snake( 1, 10 );
    pauseEvent( states.PLAYING );
    timeToWait = 0.3;
}

function nextLevel( ) { 
    // New snake, appropriate level speed and set state to normal
    snake = new Snake( 1, 10 );
    timeToWait = ( ( maxLevel - gameBasic.level ) / maxLevel ) * 0.2 + 0.1;
    pauseEvent( states.PLAYING );
}