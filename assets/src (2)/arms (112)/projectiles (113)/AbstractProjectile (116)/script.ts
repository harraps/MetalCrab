interface IEmission {
    damage : number; // damage dealt by the emission
    timer  : number; // the life time of the emission
    force  : number; // the force to apply to the collided object
    impact : string; // the prefab to load on impact
    // allow to init the weapon
    init( weapon : AbstractWeapon, position : Sup.Math.Vector3, orientation : Sup.Math.Quaternion );
}

abstract class AbstractProjectile extends Sup.Behavior implements IEmission{
    
    protected weapon : AbstractWeapon; // the weapon which created this projectile
    
    public speed  : number = 50;
    public damage : number = 10;   // the number of damage deal at direct hit
    public timer  : number = 2;    // the life time of the projectile in seconds
    public force  : number = null; // the force to apply to the collided object
    public impact : string = null; // the impact prefab to create if the projectile collide with something
    
    public init( weapon : AbstractWeapon, position : Sup.Math.Vector3, orientation : Sup.Math.Quaternion ){
        this.weapon = weapon;
        this.actor.setPosition   ( position    );
        this.actor.setOrientation( orientation );
    }
    
    public awake(){
        this.speed *= Util.deltaTime;
        this.timer *= Sup.Game.getFPS();
    }
    
    public update(){
        // main timer
        --this.timer;
        if( this.timer < 0 ){ // timer is over
            this.collide( this.actor.getPosition(), this.actor.getOrientation() );
            return;
        }
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
