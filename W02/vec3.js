class Vec3{

    // Constructor
    constructor( x, y, z )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Add method
    add( v )
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    // Sub method
    sub( v )
    {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    // Sum method
    sum()
    {
        return this.x + this.y + this.z;
    }

    // Min method
    min()
    {
        //return Math.min(this.x, this.y, this.z);
        const m =  this.x < this.y ? this.x : this.y;
        return m < this.z ? m : this.z;
    }

    // Max method
    max()
    {
        //return Math.max( this.x, this.y, this.z );
        const m = this.x > this.y ? this.x : this.y;
        return m > this.z ? this.z : m;
    }

    // Mid method
    mid()
    {
        return this.sum() - this.min() - this.max();
    }

    // Cross method
    cross( v )
    {
        var x = this.x, y = this.y, z = this.z;
        var nx = y * v.z - z * v.y;
        var ny = z * v.x - x * v.z;
        var nz = x * v.y - y * v.x;
        return new Vec3(nx, ny, nz);
    }

    // Length method
    length()
    {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    }
}