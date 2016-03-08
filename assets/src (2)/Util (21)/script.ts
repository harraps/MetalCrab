// we define a name space
let Util = {
    
    TAU    : Math.PI*2,   // TAU is just the double of PI
    halfPI : Math.PI*0.5, // this is a shortcut since we often need this value
    
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
    
    bodiesAreInContact(bodyA, bodyB){
    for(var i=0; i<WORLD.contacts.length; i++){
        var c = WORLD.contacts[i];
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
    // this function can be used for ground or ceilling detection
    checkCollision( ray : CANNON.Ray, vertice : CANNON.Vec3, angle : number = null,  padding_contact : number = -0.5, padding_emit : number = 0.1 ) : boolean{
        vertice = vertice.clone();
        let contact = vertice.clone();
        // we add padding to both vector
        vertice.y += padding_emit;
        contact.y += padding_contact;
        // we perform the raycast
        ray.intersectWorld( WORLD, Util.createIRay( vertice, contact ) );
        // if we didn't specified an angle
        if( angle == null ){
            return ray.hasHit;
        }else{
            // if the raycast has hit
            if( ray.hasHit ){
                // we compare the hit normal to the vector up
                let normal = Util.getSupVec(ray.result.hitNormalWorld).angleTo(Sup.Math.Vector3.up());
                // if the angle from the normal to the vector up is lower than the angle we gave
                return(normal < angle);
            }
        }
        return false;
    }
};
