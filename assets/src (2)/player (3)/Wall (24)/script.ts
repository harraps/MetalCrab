class PlayerWall extends PlayerAttribute {
    
    protected direction   : CANNON.Vec3; // the direction of the contact from the central axis of the player
    protected normal      : CANNON.Vec3; // the normal of the contact point
    // protected wall      : CANNON.Body; // the wall
    protected walled      : boolean;
    protected orientation : number;
    
    public init( controller : PlayerController ) {
        super.init( controller );
        this.walled = false;
        this.ctrl.Body.addEventListener("collide",(event) =>{
            // event has the following attributes:
            // type    : string
            // body    : CANNON.Body
            // contact : CANNON.ContactEquation
            // target  : CANNON.Body
            let contact : CANNON.ContactEquation = event.contact;
            // we can wall jump only if we are colliding with a wall
            if( -0.1 < contact.ni.y && contact.ni.y < 0.1 ){
                // the player is against a wall, he is walled
                this.walled = true;
                // we recover the normal of the surface of contact
                this.normal = contact.ni.clone();
                // we recover a vector from the center of the collider to the contact point
                this.direction = contact.rj.mult(1.5);
                // we only need a horizontal vector
                this.direction.y = 0;
            }
        });
    }

    public update() {
        
        // if the player is or was in contact with a wall
        if( this.walled ){
            // we check if the player is still in contact with the wall
            let wall_found = false;
            let ray = new CANNON.Ray();
            for( let vert of this.ctrl.CenterVertices ){
                // we generate rays from the central axis of the player
                let origin = this.ctrl.Body.position.vadd(vert);
                // to the point where we should touch the wall
                let dir = origin.vadd(this.direction);
                let iray = Util.createIRay( origin, dir );
                // if we found a contact
                if( ray.intersectWorld(WORLD, iray) ){
                    wall_found = true; // we found a wall
                    break; // we don't need to check the other contact points
                }
            }
            // if we didn't found a wall
            if( !wall_found ){
                // the player is no longer in contact with a wall
                this.walled = false;
            }
        }
        // if the player is walled, press the jump button but is not on the ground
        if( this.walled && this.ctrl.input.getJump() && !this.ctrl.ground.Grounded ){
            // we generate a new velocity
            let newVel = this.normal.clone();
            newVel.x *= this.ctrl.jump*0.5;
            newVel.z *= this.ctrl.jump*0.5;
            newVel.y = this.ctrl.jump;
            // the player perform a jump
            this.ctrl.move.airVelocity = 0;
            // we apply the velocity
            this.ctrl.Body.velocity = newVel;
            // the player jumped from the wall, chance are that he is not walled anymore
            this.walled = false;
            this.direction = null;
            
            // we want to rotate the player towards the direction he is walljumping
            // we use the atan2 function because we need the sign of the angle
            this.orientation = Math.atan2( this.normal.z, -this.normal.x );
            //the 0 angle match the x-axis of the player
            this.orientation += Util.halfPI;
        }
        if( this.orientation != null ){
            let rotation = 0.3;
            // we recover the angle of rotation remaining
            let angle = Util.getAngle( this.ctrl.look.Angle.x, this.orientation );
            // if our angle of rotation is greater than the remaining angle
            if( rotation > Math.abs(angle) ){
                this.orientation = null; // we are done
            }else if( angle > 0 ){ // we rotate counterclockwise
                this.ctrl.look.addRotation(rotation);
            }else if( angle < 0 ){ // we rotate clockwise
                this.ctrl.look.addRotation(-rotation);
            }
        }
    }
}
