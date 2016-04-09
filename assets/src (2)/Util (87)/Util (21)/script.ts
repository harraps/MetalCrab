// we define a name space
let Util = {
    
    deltaTime : 100 / Sup.Game.getFPS(), // return the time passed for 100 frames -> normalize speed variables
    
    TAU       : Math.PI*2,   // TAU is just the double of PI
    halfPI    : Math.PI*0.5, // this is a shortcut since we often need this value
    
    // return a random value within the given boundaries
    random( from : number, to : number ){
        return Math.random()*(to - from) - from;
    },
    // Mathematic functions
    smallestAngle( a ){
        a %= Util.TAU;
        if( a > Math.PI ){
            a -= Util.TAU;
        }else if( a < -Math.PI ){
            a += Util.TAU;
        }
        return a;
    },
    getPositiveAngle( a ) : number{
        return Util.angleMod( a, Util.TAU );
    },
    angleMod( a, n ) : number{
        return (a % n + n) % n;
    },
    getAngle( from, to ) : number{
        // we convert the angles to positive one
        from = Util.getPositiveAngle( from );
        to   = Util.getPositiveAngle( to   );
        return Util.smallestAngle( to - from );
    },
    
    // conversion functions
    getCannonVec( vec : Sup.Math.Vector3 ) : CANNON.Vec3 {
        return new CANNON.Vec3(vec.x,vec.y,vec.z);
    },
    getSupVec( vec : CANNON.Vec3 ) : Sup.Math.Vector3 {
        return new Sup.Math.Vector3(vec.x,vec.y,vec.z);
    },
    getCannonQuat( quat : Sup.Math.Quaternion ) : CANNON.Quaternion {
        return new CANNON.Quaternion(quat.x,quat.y,quat.z,quat.w);
    },
    getSupQuat( quat : CANNON.Quaternion ) : Sup.Math.Quaternion {
        return new Sup.Math.Quaternion(quat.x,quat.y,quat.z,quat.w);
    },
    
    // orientation functions
    getLeft( q : Sup.Math.Quaternion ) : Sup.Math.Vector3 {
        return new Sup.Math.Vector3(
            1 - 2*( q.y*q.z - q.z*q.z ),
            2*( q.x*q.y + q.z*q.w ),
            2*( q.x*q.z - q.y*q.w )
        );
    },
    getUp( q : Sup.Math.Quaternion ) : Sup.Math.Vector3 {
        return new Sup.Math.Vector3(
            2*( q.x*q.y - q.z*q.w ),
            1 - 2*( q.x*q.x - q.z*q.z ),
            2*( q.y*q.z + q.x*q.w )
        );
    },
    getForward( q : Sup.Math.Quaternion ) : Sup.Math.Vector3 {
        return new Sup.Math.Vector3(
            2*( q.x*q.z + q.w*q.y ),
            2*( q.y*q.x - q.w*q.x ),
            1 - 2*( q.x*q.x + q.y*q.y )
        );
    },
    lookRotation( forward : Sup.Math.Vector3, up : Sup.Math.Vector3 = Sup.Math.Vector3.up() ) : Sup.Math.Quaternion {
        // we create 3 vectors
        let v2 = forward.clone().normalize();
        let v0 = up.clone().cross(v2).normalize();
        let v1 = v2.clone().cross(v0);
        // we declare our variables
        let q = new Sup.Math.Quaternion();
        let a, b : number;
        // we calculate the component of the quaternion 
        a = v0.x + v1.y + v2.z;
        if(a > 0){
            b = Math.sqrt(a + 1);
            q.w = 0.5*b;
            b = 0.5/b;
            q.x = (v1.z - v2.y)*b;
            q.y = (v2.x - v0.z)*b;
            q.z = (v0.y - v1.x)*b;
            return q;
        }
        if((v0.x >= v1.y) && (v0.x >= v2.z)){
            a = Math.sqrt(1 + v0.x - v1.y - v2.z);
            b = 0.5/a;
            q.x = 0.5*a;
            q.y = (v0.y + v1.x)*b;
            q.z = (v0.z + v2.x)*b;
            q.w = (v1.z - v2.y)*b;
            return q;
        }
        if(v1.y > v2.z){
            a = Math.sqrt(1 + v1.y - v0.x - v2.z);
            b = 0.5/a;
            q.x = (v1.x + v0.y)*b;
            q.y = 0.5*a;
            q.z = (v2.y + v1.z)*b;
            q.w = (v2.x - v0.z)*b;
            return q;
        }
        a = Math.sqrt(1 + v2.z - v0.x - v1.y);
        b = 0.5/a;
        q.x = (v2.x + v0.z)*b;
        q.y = (v2.y + v1.z)*b;
        q.z = 0.5*a;
        q.w = (v0.y - v1.x)*b;
        return q;
    },
    
    // this function allow us to now if both bodies are in contact
    bodiesAreInContact(bodyA, bodyB){
    for(var i=0; i<GAME.level.World.contacts.length; i++){
        var c = GAME.level.World.contacts[i];
        if((c.bi === bodyA && c.bj === bodyB) || (c.bi === bodyB && c.bj === bodyA)){
            return true;
        }
    }
        return false;
    },
    
    // shortcut functions
    // allow us to create irays
    createIRay( from : CANNON.Vec3, to : CANNON.Vec3, filter = -1 ) : CANNON.IRayIntersectWorldOptions {
        return {
            from : from, // the starting point of the ray
            to   : to,   // the   ending point of the ray
            mode : CANNON.Ray.ANY,
            result : false,
            callback : null,
            skipBackfaces : true, // we don't need to check for back face
            collisionFilterMask  : filter, // we check intersection with object of the given group
            collisionFilterGroup : -1      // this ray isn't part of a group
        };
    },
    // allow us to create irays from Sup.Math.Vector3
    createIRaySup( from : Sup.Math.Vector3, to : Sup.Math.Vector3, filter = -1 ){
        return Util.createIRay( Util.getCannonVec(from), Util.getCannonVec(to), filter );
    },
    // we cast a ray from the first vector to the second one, return the result
    raycast( from : Sup.Math.Vector3, to : Sup.Math.Vector3, filter: number ): CANNON.RaycastResult{
        let iray = Util.createIRaySup( from, to, filter );
        let ray = new CANNON.Ray();
        // we check if the bullet collide with something
        ray.intersectWorld(GAME.level.World, iray);
        return ray.result;
    }
};

// we add a new function to arrays to remove elements faster
(<any>Array.prototype).remove = function( from : number, to : number ){
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};