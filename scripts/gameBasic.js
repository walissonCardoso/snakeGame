let greenStroke = 'rgb(47,226,98)';

class GameBasic {
    constructor ( xCells, yCells, maxLevel = 10 ) {
        // First row is used for showing score
        this.xCells = xCells;
        this.yCells = yCells;
        // Cell size not calculated yet
        this.cellSize = 0;
        
        // Display related variables
        this.width = 0;
        this.height = 0;
        // Proportion of the screen
        this.proportion = (xCells * 1.0) / yCells;
        
        // Initial score values
        this.score = 0;
        this.level = 1;
        this.maxLevel = maxLevel;
        
        // Screen blink if this values are altered externally
        this.blinkScreen = false;
        this.blinkScore = false;
        // Alternates between true and false, so the screen blinks
        this.blinkRegister = false;
    }
    
    updateWidthHeight( ) {
        // This function updates the screen size when window is resized
        // First try to stablish the biggest windows possible
        this.height = int( windowHeight );
        this.width = int( this.height * this.proportion );
        // With resulting size is too big, do the calculation using
        // the width as basis
        if( this.width > windowWidth ) {
            this.width = windowWidth;
            this.heigth = int(this.width / this.proportion);
        }
        // Reduce the canvas by 5% to avoid side bar
        this.width = int( this.width * 0.9 );
        this.height = int( this.height * 0.9 );
        this.cellSize = int( this.width / this.xCells );
        
        textSize( this.cellSize );
    }
    
    drawBackground( ) {
        // Alternates register value
        this.blinkRegister = !this.blinkRegister
        
        // Draw background
        background( 0 );
        stroke( greenStroke );
        strokeWeight( 1 );
        
        // Text configuration
        textAlign(LEFT, TOP);
        fill( greenStroke )
        
        // Shows everytime or blink (if desired)
        if( !this.blinkScore || this.blinkRegister ){
            // Elements positionated at the top
            text( 'Score: ' + str( this.score ), 10, 0 );
            text( 'Level: ' + str( this.level ), this.width / 2 + 10, 0 );
        }
        
        strokeWeight( 4 )
        noFill( );
        
        // Shows everytime or blink (if desired)
        if( !this.blinkScreen || this.blinkRegister )
            // Draws big rectangle that marks the game
            rect( 0, this.cellSize, this.width, ( this.yCells - 1 ) * this.cellSize );
    }
    
    drawCell( point, type = 0 ) {
        // This function drawn a single small rectangle on screen
        // cordinates: (point.x, point.y)
        
        // If blinking, this is show one time at every two frames
        if( this.blinkScreen && (!this.blinkRegister) )
            return
        
        strokeWeight( 4 );
        if( type == 0 ){
            // Draws bigger rectangle with no fill
            noFill( );
            rect( point.x * this.cellSize + 2, point.y * this.cellSize + 2, this.cellSize - 4, this.cellSize-4 );
        }
        
        // Draws inner rectangle
        let pad = this.cellSize / 3;
        fill( greenStroke );
        rect( point.x * this.cellSize + pad,
              point.y * this.cellSize + pad,
              this.cellSize - 2 * pad,
              this.cellSize - 2 * pad );
    }
    
    isInsideGame( point ) {
        // Verifies if a point is inside game. Y starts at 1
        // because first row is used for score and level labels
        return point.x >= 0 && point.x < this.xCells &&
               point.y >= 1 && point.y < this.yCells
    }
    
    incScore( ) {
        this.score += 5
    }
    
    incLevel( ) {
        // Increase level if it is possible
        if( this.level < this.maxLevel ) {
            this.level += 1;
            return true
        }
        return false
    }
    
    resetScore( ) {
        this.score = 0;
        this.level = 1;
    }
}