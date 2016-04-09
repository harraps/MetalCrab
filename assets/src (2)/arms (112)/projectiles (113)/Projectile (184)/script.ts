// projectile that move in one direction
class Projectile extends AbstractProjectile {
    
    protected movement : Sup.Math.Vector3;
    
    public init( weapon : AbstractWeapon, position : Sup.Math.Vector3, orientation : Sup.Math.Quaternion ) {
        super.init( weapon, position, orientation );
        // we calculate the vector of the movement
        this.movement = new Sup.Math.Vector3( 0,0,-this.speed );
        this.movement.rotate(orientation);
    }
    
    public update() {
        super.update(); // we update the timer
        
        // we move the projectile in the right direction
        this.actor.moveOrientedZ(-this.speed);
        // we calculate the position of the projectile at the next frame
        let destination = this.actor.getPosition();
        destination.add(this.movement);
        
        // we cast a ray in front of the projectile
        let result = Util.raycast( this.actor.getPosition(), destination, -1 );
        if( result.hasHit ){ // we collide with something
            // if we have the force attribute set
            if( this.force != null && result.body.mass > 0 ){
                // we recover a force vector from the orientation of the projectile and the mass of the collided object
                let force = Util.getForward(this.actor.getOrientation()).multiplyScalar(-this.force / result.body.mass);
                // we add the vector to the velocity vector of the collided object
                result.body.velocity.vadd(Util.getCannonVec(force));
            }
            
            // we recover position and normal of the surface contact
            let hitPoint  = Util.getSupVec(result.hitPointWorld);
            let hitNormal = Util.getSupVec(result.hitNormalWorld);
            
            // we apply damage to the collided object
            let status = GAME.level.getStatus( result.body.id );
            if(status == null) this.collideWithoutStatus( hitPoint, hitNormal );
            else this.collideWithStatus( status, hitPoint, hitNormal );
        }
    }
    // what happen when we collide with an object that has a status
    protected collideWithStatus( status : IStatus, hitPoint : Sup.Math.Vector3, hitNormal : Sup.Math.Vector3 ){
        status.damage(this.damage);
        this.collide(hitPoint, hitNormal);
    }
    // what happen when we collide with an object that hasn't a status
    protected collideWithoutStatus( hitPoint : Sup.Math.Vector3, hitNormal : Sup.Math.Vector3 ){
        this.collide(hitPoint, hitNormal);
    }
    
}
Sup.registerBehavior(Projectile);

// projectile that bounce off object without a status
class BouncingProjectile extends Projectile{
    // we want our projectile to collide with objects with a status
    // but to bounce on objects without one
    // what happen when we collide with an object that hasn't a status
    protected collideWithoutStatus( hitPoint : Sup.Math.Vector3, hitNormal : Sup.Math.Vector3 ){
        // we recover the vector along the movement
        let vec_V = Util.getForward(this.actor.getOrientation());
        // the vector pointing toward the wall
        let vec_U = vec_V.clone().cross(hitNormal).cross(hitNormal);
        // the vector along the wall
        let vec_W = vec_V.clone().subtract(vec_U);
        // we recover the symetrical vector
        vec_V = vec_W.subtract(vec_U);
        // we update the movement vector
        this.movement = vec_V.normalize().multiplyScalar(this.speed);
        // we rotate the actor in the direction of movement
        this.actor.setOrientation( Util.lookRotation(this.movement) );
    }
}
Sup.registerBehavior(BouncingProjectile);
