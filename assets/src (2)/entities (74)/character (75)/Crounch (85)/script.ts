class CharacterCrounch implements IAttribute {
    
    public ctrl : CharacterController;
    
    private defaultHeight : number;
    
    // we keep track of the current height of the player
    protected height    : number;
    protected crounched : boolean;
    
    // GETTER
    public get Crounched() : boolean{
        return this.crounched;
    }
    
    public init( controller : CharacterController ){
        this.ctrl = controller;
        // we keep track of the height of the player
        this.defaultHeight = this.ctrl.Vertices[0].z;
        this.height = this.defaultHeight;
    }
    
    public update(){
        let canGetUp = true;
        //this.crounched = false;
        // if we press the crounch button
        if( this.ctrl.input.getCrounch() ){
            canGetUp = false;
            this.crounched = true;
        }else if( this.crounched == true ) { // if the player is already crounched
            // if there is no ceiling hover his head
            canGetUp = this.canGetUp();
        }
        if( !canGetUp ){
            // if we haven't reach the crounched position yet
            if( this.height < 0 ){
                // we bring the bottom toward the origin
                this.height += 0.1;
                // if we passed by the center of the cylinder, we cap it
                if( this.height > 0 ) this.height = 0;
                // we apply the changes to each vertice
                this.ctrl.changeHeight(this.height);
            }
        }else{
            // if we haven't reach the stand up position yet
            if( this.height > this.defaultHeight ){
                // we push the bottom from the origin
                this.height -= 0.1;
                // if we passed by the default height of the player
                if( this.height <= this.defaultHeight ){
                    // we cap the value
                    this.height = this.defaultHeight;
                    // the player is no longer crounched
                    this.crounched = false;
                }
                // we apply the changes to each vertice
                this.ctrl.changeHeight(this.height);
            }
        }
    }
    
    // return true if the player has a ceiling hover his head that would prevent him from being stand up
    protected canGetUp() : boolean {
        // we recover the origin of the player
        let origin = Util.getCannonVec( this.ctrl.actor.getPosition() );
        // we create a ray object
        let ray = new CANNON.Ray();
        // we try the center of the face first
        if( this.checkCeiling( ray, origin, this.ctrl.TopVertice ) ){
            // the player has a ground beneath it's feet, we don't need to check the other contact points
            return false;
        }
        // we check each uneven vertice
        for( let i=1; i<this.ctrl.Collider.vertices.length; i += 2 ){
            if( this.checkCeiling( ray, origin, this.ctrl.Vertices[i] ) ){
                // we found atleast one contact, we don't need to check the other contact points
                return false;
            }
        }
        return true;
    }
    
    protected checkCeiling( ray : CANNON.Ray, origin : CANNON.Vec3, vertice : CANNON.Vec3 ) : boolean{
        // we create the contact points
        let contact =  origin.clone();
        contact.x += vertice.x;
        contact.y += vertice.z;
        contact.z -= vertice.y;
        // we check for collisions with the ground
        if( Util.checkCollision( ray, contact, null, this.height - this.defaultHeight, -0.1 ) ){
            // we found at least one contact point, we don't need to check the others
            return true;
        }
        return false;
    }
}
