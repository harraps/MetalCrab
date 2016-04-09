class CharacterMove implements IAttribute {
    
    public ctrl : CharacterController;
    
    protected airVel : number = 0;
    protected regain : number = 0.001; // how fast does the player regain control in the air
    
    // SETTER
    public set airVelocity( value : number ){
        this.airVel = value;
    }
    
    public init( controller : CharacterController ){
        this.ctrl = controller;
    }
    
    public update(){
        let speed = this.ctrl.speed;
        if( this.ctrl.crounch.Crounched ){
            speed = this.ctrl.crounchSpeed;
        }
        
        // we recover the angle of the player horizontaly
        let angle = this.ctrl.look.Angle.x;
        let move  = this.ctrl.input.getMove();
        
        // we recover the velocity of the player
        let oldVel = this.ctrl.body.velocity;
        let newVel = new CANNON.Vec3();
        
        // we calculate the new velocity based on the inputs of the player
        newVel.x = ( move.x*Math.cos(angle) -move.y*Math.sin(angle)) * speed;
        newVel.z = (-move.x*Math.sin(angle) -move.y*Math.cos(angle)) * speed;
        
        // we keep the same vertical velocity
        newVel.y = oldVel.y;
        
        // if the player is on the ground
        if( this.ctrl.ground.Grounded ){
            // we reset the air velocity modifier
            this.airVel = 0;
            
            if( this.ctrl.input.getJump() ){
                newVel.y = this.ctrl.jump;
                // we increase the value of air velocity modifier to give more air control when jumping
                this.airVel = 0.5;
            }
        } else { // the player is in the air
            // if the air velocity modifier is under the max air control
            if( this.airVel < this.ctrl.airControl ){
                // we slowly regain control of the movement
                this.airVel += this.regain;
                // if we passed the max air control
                if( this.airVel > this.ctrl.airControl ){
                    // we cap the value
                    this.airVel = this.ctrl.airControl;
                }
            }
            // we apply the new velocity but reduce it's impact
            newVel.x = newVel.x*this.airVel + oldVel.x*(1-this.airVel);
            newVel.z = newVel.z*this.airVel + oldVel.z*(1-this.airVel);
        }
        // we apply the calculated velocity to the player
        this.ctrl.body.velocity = newVel;
    }
}
