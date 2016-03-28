class Projectile extends Sup.Behavior {
    
    protected weapon : AbstractWeapon; // the weapon which created this projectile
    
    public speed  : number = 10;
    public damage : number = 10;   // the number of damage deal at direct hit
    public timer  : number = 2;    // the life time of the projectile in seconds
    public impact : string = null; // the impact prefab to create if the projectile collide with something
    
    protected vector : Sup.Math.Vector3;
    
    public awake(){
        this.speed *= Util.deltaTime;
        this.timer *= Sup.Game.getFPS();
        this.vector = new Sup.Math.Vector3( 0,0,-this.speed );
    }
    
    public init( weapon : AbstractWeapon, position : Sup.Math.Vector3, orientation : Sup.Math.Quaternion ) {
        this.weapon = weapon;
        this.actor.setPosition   ( position    );
        this.actor.setOrientation( orientation );
        
        this.vector.rotate(orientation);
    }
    
    public update() {
        // main timer
        --this.timer;
        if( this.timer < 0 ){ // timer is over
            this.collide( this.actor.getPosition(), this.actor.getOrientation() );
            return;
        }
        // we calculate the position of the projectile at the next frame
        let destination = this.actor.getPosition();
        destination.add(this.vector);
        
        // we cast a ray in front of the projectile
        let result = this.raycast( this.actor.getPosition(), destination, -1 );
        if( result != null ){ // we collide with something
            // we recover position and normal of the surface contact
            let hitPoint  = Util.getSupVec(result.hitPointWorld);
            let hitNormal = Util.getSupVec(result.hitNormalWorld);
            this.collide( hitPoint, hitNormal );
        }
    }
    
    // we cast a ray from the first vector to the second one, if we hit something we run the collide function
    protected raycast( from : Sup.Math.Vector3, to : Sup.Math.Vector3, filter: number ): CANNON.RaycastResult{
        let iray = Util.createIRaySup( from, to, filter );
        let ray = new CANNON.Ray();
        // we check if the bullet collide with something
        if( ray.intersectWorld( GAME.level.World, iray ) ){
            return ray.result;
        }
        return null;
    }

    public collide( position : Sup.Math.Vector3, orientation : Sup.Math.Vector3|Sup.Math.Quaternion ){
        if( this.impact != null ){
            // we append the impact specified
            let explosion = Sup.appendScene(this.impact)[0];
            // we put the explosion at the specified place
            explosion.setPosition(position);
            if( orientation instanceof Sup.Math.Vector3 ){
                explosion.lookTowards( orientation );
            }else{
                explosion.setOrientation( <Sup.Math.Quaternion> orientation );
            }
        }
        this.actor.destroy();
    }
}
Sup.registerBehavior(Projectile);
