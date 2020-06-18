class Point {
    constructor( x = 0, y = 0 ) {
        this.x = x;
        this.y = y;
    }
    
    isEqualTo( point ) {
        if( this.x == point.x && this.y == point.y )
            return true;
        else
            return false;
    }
    
    randomPoint( minX, minY, maxX, maxY ) {
        this.x = int( random( 0, maxX - minX ) ) + minX;
        this.y = int( random( 0, maxY - minY ) ) + minY;
    }
}
