const dir = { NONE:0, LEFT: 1, RIGHT: 2, UP: 3, DOWN: 4 };

let catchSound;

// There are some limitations for playing sound,
// So I enveloped on a try-catch structure so I
// don't need to keep commenting these lines of
// code when testing offline
function preload( ) {
    try {
        soundFormats( 'mp3' );
        catchSound = loadSound( 'food.mp3' );
    } catch( e ) {
        print( 'Could not load sound.' )
    }
}

class Snake {
    // Snake is composed of a head, a tail that follow the
    // head and a direction it is goind.
    constructor( x = 0, y = 0 ) {
        this.direction = dir.NONE;
        this.nextDirection = dir.NONE;
        this.lastDirection = dir.RIGHT;
        
        this.head = new Point( x, y )
        this.tail = [new Point( x - 1, y )]
        this.moveIndex = 0
    }
    
    command( direction ) {
        if( this.direction == dir.NONE ) {
            // If user did not send a command yet in this iteration,
            // verify if command is not invalid and set command.
            if( !this.oposedDirections( this.lastDirection, direction ) )
                this.direction = direction;
        } else {
            // If user already sent a command, save as next command to
            // execute next iteration, if does not oposes current command.
            // (think of this as a stack with only two elements. That's what
            //  allow us to perform fast turns)
            if( !this.oposedDirections( this.direction, direction ) )
                this.nextDirection = direction;
        }
    }
    
    updatePosition( ) {
        // This function moves the snake according its direction
        if( this.direction == dir.NONE ) {
            // If we used current direction, get next
            this.direction = this.nextDirection;
            this.nextDirection = dir.NONE;
        }
        if( this.direction == dir.NONE ) {
            // If user did not send a command, use last
            this.direction = this.lastDirection;
        }
        this.move( this.direction )
        this.lastDirection = this.direction;
        this.direction = dir.NONE;
    }

    move( direction ) {
        // Besides moving the head, we need to move the tail.
        // Moving the last updated item on the list creates the
        // illusion of a moving body and it is more efficient.
        this.tail[ this.moveIndex ].x = this.head.x
        this.tail[ this.moveIndex ].y = this.head.y
        this.moveIndex = ( this.moveIndex + 1 ) % this.tail.length
        
        // Move the head
        switch( direction ){
            case dir.LEFT: 
                this.head.x--; break;
            case dir.RIGHT:
                this.head.x++; break;
            case dir.UP:
                this.head.y--; break;
            case dir.DOWN:
                this.head.y++; break;
        }
    }
    
    oposedDirections( dir1, dir2 ) {
        // Verify if two directions are oposed to each other
        if( ( dir1 == dir.LEFT && dir2 == dir.RIGHT ) ||
            ( dir2 == dir.LEFT && dir1 == dir.RIGHT ) ||
            ( dir1 == dir.UP && dir2 == dir.DOWN ) ||
            ( dir2 == dir.UP && dir1 == dir.DOWN ) )
            return true;
        else
            return false;
    }
    
    eat( food ) {
        // Add an element to snake's body
        this.tail.push( new Point( food.x, food.y ) )
        
        // Try to play sound
        try {
            catchSound.play( );
        } catch( e ) {
            print( 'Could not play sound.' )
        }
    }
    
    isPointInside( point ) {
        // Verifies if coordinates of 'point' match any of the
        // snake body
        for( let cell of this.tail ) {
            if( cell.isEqualTo( point ) )
                return true;
        }
        return false;
    }
}