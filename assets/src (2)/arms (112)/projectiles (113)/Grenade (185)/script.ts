class Grenade extends AbstractProjectile {
    
    protected static minVelocity : number = 20;
    
    public upward : number = 10; // the force to apply to the grenade on the up axis
    
    protected body : CANNON.Body;
    
    public init( weapon : AbstractWeapon, position : Sup.Math.Vector3, orientation : Sup.Math.Quaternion ){
        super.init( weapon, position, orientation );
        
        // we init the position and orientation of the cannon body
        this.body = this.actor.cannonBody.body;
        this.body.position   = Util.getCannonVec (position   );
        this.body.quaternion = Util.getCannonQuat(orientation);
        
        // we init the velocity of the body
        let vel = Util.getForward(orientation).multiplyScalar(-this.speed);
        vel.y += this.upward;
        this.body.velocity = Util.getCannonVec(vel);
        
        // we add a listener to detect when the grenade touch something
        this.body.addEventListener("collide",(event)=>{
            // we recover the collided body
            let body = event.contact.bi;
            let status = GAME.level.getStatus(body.id);
            // if the collided body has a status and the velocity is high enough
            if( status != null && this.body.velocity.norm() > Grenade.minVelocity ){
                status.damage(this.damage);
                this.collide(this.actor.getPosition(), Util.getSupQuat(event.contact.ni));
            }
        });
    }
}
Sup.registerBehavior(Grenade);
