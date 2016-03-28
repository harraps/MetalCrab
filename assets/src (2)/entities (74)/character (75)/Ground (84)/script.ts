class CharacterGround implements IAttribute {
    
    public ctrl : CharacterController;
    
    protected grounded : boolean = false;
    
    protected platform  : CANNON.Body;
    protected globalPos : CANNON.Vec3;
    protected localPos  : CANNON.Vec3;
    protected globalRot : CANNON.Quaternion;
    protected localRot  : CANNON.Quaternion;
    
    // GETTER
    public get Grounded() : boolean {
        return this.grounded;
    }
    
    public init(controller : CharacterController){
        this.ctrl = (controller);
        
        // we add the PlayerGround to the list to support moving platforms
        GAME.level.addGroundModule(this);
    }
    
    public update(){
        // we reset the grounded variable
        this.grounded = false;
        // we recover the origin of the player
        let origin = Util.getCannonVec( this.ctrl.actor.getPosition() );
        // we create a ray object
        let ray = new CANNON.Ray();
        // we try the center of the face first
        if( this.checkGround( ray, origin, this.ctrl.BottomVertice ) ){
            // the player has a ground beneath it's feet, we don't need to check the other contact points
            return;
        }
        // we check each even vertice
        for( let i=0; i<this.ctrl.Vertices.length; i += 2 ){
            if( this.checkGround( ray, origin, this.ctrl.Vertices[i] ) ){
                // we found atleast one contact, we don't need to check the other contact points
                return;
            }
        }
        // we have check all of the contact points, we are sure the player is not on the ground
        this.platform = null;
    }
    
    public updatePosition(){
        // if we are on a platform
        if( this.platform != null ){
            // we calculate the movement of the platform since the last update
            let newGlobalPos = this.platform.pointToWorldFrame( this.localPos );
            let moveDistance = newGlobalPos.vsub( this.globalPos );
            // we apply the movement to the player
            this.ctrl.Body.position = this.ctrl.Body.position.vadd( moveDistance );
            
            // we calculate the rotation of the platform since the last update
            let newGlobalRot = this.platform.quaternion.mult( this.localRot );
            let rotationDiff = newGlobalRot.mult( this.globalRot.inverse() );
            // we need to make sure the player stay upright
            let vec = new CANNON.Vec3();
            rotationDiff.toEuler(vec);
            // we only rotate the player on the Y-axis
            this.ctrl.look.addRotation(vec.y);
        }
    }
    
    public updatePlatform(){
        // if we are on a platform
        if( this.platform != null ){
            // we recover the position of the platform for the next update
            this.globalPos = this.ctrl.Body.position;
            this.localPos  = this.platform.pointToLocalFrame( this.ctrl.Body.position );
            // we recover the rotation of the platform for the next update
            this.globalRot = this.ctrl.Body.quaternion;
            this.localRot  = this.platform.quaternion.inverse().mult( this.ctrl.Body.quaternion );
        }
    }
    
    // this function is called for each contact point of the bottom of the cylinder
    protected checkGround( ray : CANNON.Ray, origin : CANNON.Vec3, vertice : CANNON.Vec3 ) : boolean {
        // we create the contact points
        let contact =  origin.clone();
        contact.x += vertice.x;
        contact.y += vertice.z;
        contact.z -= vertice.y;
        // we check for collisions with the ground
        if( Util.checkCollision( ray, contact, this.ctrl.steepSlope, -0.5 ) ){
            // at least one contact returned true
            this.grounded = true;
            // if the platform we landed on is KINEMATIC
            if( ray.result.body.type == CANNON.Body.KINEMATIC ){
                // we keep track of the platform we landed on
                let platformChange = this.platform != ray.result.body;
                this.platform = ray.result.body;
                // we changed of platform
                if( platformChange ){
                    // we need to update the platform
                    this.updatePlatform();
                }
            }else{
                // we landed on a non kinematic platform
                this.platform = null;
                // we cannot support moving platform if the platform is not kinematic
            }
            // we found at least one contact point, we don't need to check the others
            return true;
        }
        return false;
    }
}
