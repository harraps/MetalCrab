class Shotgun extends AbstractWeapon {
    
    public damage   : number =  10; // damage dealt by a single pellet
    public distance : number = 100; // the farest point reachable with the pellets
    public pellets  : number =   8; // define the number of pellets to generate
    public spread   : number =   2; // define the radius of the sphere of random pellets
    public force    : number =  10; // the force applied by each pellet on impact
    public impact   : string;       // the impact prefab to append when a pellet hit
    
    public fire( fire : IFireInput ){
        // we only use the pulse value
        if( fire.pulse && this.timer < 0 ){
            // if we cannot remove ammo, we stop right here
            if(!this.removeAmmo()) return;
            
            let force : CANNON.Vec3 = null;
            if( this.force != null ){
                // we recover a force vector from the orientation of the projectile and the mass of the collided object
                let force = Util.getCannonVec(Util.getForward(this.ctrl.head.getOrientation()).multiplyScalar(-this.force));
            }
            
            // we create a vector pointing the same direction as the character's head
            let point = Util.getCannonVec(
                new Sup.Math.Vector3(0,0,-this.distance)
                .rotate(this.ctrl.head.getOrientation())
            );
            // we recover the position of the head
            let head = Util.getCannonVec(this.ctrl.head.getPosition());
            // we change the coordinates of our point from local to global
            point.vadd(head);
            
            // we create our pellets
            for( let i=0; i<this.pellets; ++i ){
                //  we generate random pellets within a sphere
                let pellet = Shotgun.generateRandomPellet( point, this.spread );
                let iray = Util.createIRay( head, pellet );
                let ray  = new CANNON.Ray();
                // if our pellet collide with something
                if( ray.intersectWorld(GAME.level.World, iray) ){
                    // if we have defined a force vector
                    if( force != null && ray.result.body.mass > 0 ){
                        // we create a vector from our force vector
                        let vec_f = force.clone().mult( 1/ray.result.body.mass );
                        // we add velocity to the object
                        ray.result.body.velocity.vadd( vec_f );
                    }
                    
                    // if the collided object has a status
                    let status = GAME.level.getStatus(ray.result.body.id);
                    if(status != null) status.damage(this.damage);
                }
            }
            // if we have an effect object attached to the weapon, we display it
            if(this.effect != null) this.effect.show();
            // we want to avoid instant shoot right after this one
            this.resetTimer();
        }
    }
    // create a random pellet in a sphere at the given position
    protected static generateRandomPellet( pos : CANNON.Vec3, spread : number ) : CANNON.Vec3{
        let vec = pos.clone();
        vec.x += Util.random(-spread, spread);
        vec.y += Util.random(-spread, spread);
        vec.z += Util.random(-spread, spread);
        return vec;
    }
}
Sup.registerBehavior(Shotgun);
