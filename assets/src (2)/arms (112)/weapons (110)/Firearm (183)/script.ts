// regular firearm, press the trigger to shoot
class Firearm extends AbstractWeapon {
    
    public projectile : string;
    
    // update function of the gun
    public fire( fire : IFireInput ){
        // shoot function is called on pulse mode
        this.shoot(fire.pulse);
    }
    // shoot function to generate projectiles
    protected shoot( shoot : boolean ){
        // if the player is shooting and we can shoot again
        if( shoot && this.timer < 0 ){
            // we use the head as the emission point
            let pos = this.ctrl.head.getPosition();
            let rot = this.ctrl.head.getOrientation();
            // if we have defined a special emitter
            if( this.emitter != null ){
                // we create a raycast from the character's head to the emitter point
                let iray = Util.createIRaySup( this.ctrl.head.getPosition(), this.emitter.getPosition(), -1 );
                let ray  = new CANNON.Ray();
                // if the emitter pass through a wall, we change the emitter
                if(!ray.intersectWorld( GAME.level.World, iray) && this.emitter != null){
                    pos = this.emitter.getPosition();
                    rot = this.emitter.getOrientation();
                }
            }
            // if we cannot remove ammo, we stop right here
            if( !this.removeAmmo() ) return;
            // we want to prevent to instandly shoot again so we reset the timer
            this.resetTimer();
            // if the weapon has an effect, we display it
            if( this.effect != null ) this.effect.show();
            // we generate a projectile at the emission point
            let projectile = Sup.appendScene(this.projectile)[0].getBehavior(Projectile);
            projectile.init( this, this.emitter.getPosition(), this.emitter.getOrientation() );
        }
    }
}
Sup.registerBehavior(Firearm);

// automatic firearm, hold the trigger to shoot continuisly
class AutoFirearm extends Firearm {
    // the update function
    public fire( fire : IFireInput ){
        // shoot function is called on hold mode
        this.shoot(fire.hold);
    }
    
}
Sup.registerBehavior(AutoFirearm);