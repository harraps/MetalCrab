abstract class CharacterController extends BaseController {
    
    public input   : CharacterInput;
    //public status  : BaseStatus;
    //public look    : BaseLook;
    public move    : CharacterMove;
    public ground  : CharacterGround;
    public crounch : CharacterCrounch;
    
    // attributes Move
    public speed      : number = 15;  // speed of the player
    public jump       : number = 30;  // jump force of the player
    public airControl : number = 0.8; // how much does the player regain movement control in the air
    
    // attributes Ground
    public steepSlope : number = 50; // how steep is the ground the player can walk on
    
    // attributes Crounch
    public crounchHeight : number = 0.9; // height of the player when crounched
    public crounchSpeed  : number = 5;   // the speed of the player when crounched
    
    public collider : CANNON.Cylinder;
    
    // we keep track of the vertices at the center of the collider
    private centerVertices : CANNON.Vec3[];
    public get CenterVertices() : CANNON.Vec3[]{
        return this.centerVertices;
    }
    public get TopVertice() : CANNON.Vec3{
        return this.centerVertices[2];
    }
    public get MiddleVertice() : CANNON.Vec3{
        return this.centerVertices[0];
    }
    public get BottomVertice() : CANNON.Vec3{
        return this.centerVertices[1];
    }
    
    public awake() {
        super.awake();
        
        // we recalculate each attributes based on time
        this.speed        *= Util.deltaTime;
        this.airControl   *= Util.deltaTime;
        this.crounchSpeed *= Util.deltaTime;
        this.steepSlope   *= Math.PI/180; // conversion from degree to radian
        
        this.collider = <CANNON.Cylinder>this.body.shapes[0]; // our player should only have one cylindrical collider
        
        // we setup the collider of the player
        this.body.material = GAME.level.DefaultMaterial;
        
        // Cylinder are made of vertices
        //   even vertices are for the bottom face
        // uneven vertices are for the top    face
        //http://schteppe.github.io/cannon.js/docs/files/src_shapes_Cylinder.js.html#l8
        
        // we create the vertices at the center of the collider
        this.centerVertices = [];
        // we put vertices in the following order : center, bottom, top
        // the center of the collider is in (0,0,0)
        this.centerVertices[0] = new CANNON.Vec3();
        // the first vertice of the collider is the bottom right one
        this.centerVertices[1] = this.collider.vertices[0].clone();
        this.centerVertices[1].x = 0; // we move the vertice to the center
        // the second vertice of the collider is the top right one
        this.centerVertices[2] = this.collider.vertices[1].clone();
        this.centerVertices[2].x = 0; // we move the vertice to the center
        
        // we initialize each module of the character then
    }
    
    public update(){
        super.update();
    }
    
    // this function allow us to change the height of the collider (for crounching)
    public changeHeight( height : number ){
        // we only change the vertices at the bottom
        this.centerVertices[1].z = height;
        for( let i=0; i<this.collider.vertices.length; i += 2 ){
            this.collider.vertices[i].z = height;
        }
    }

    public deleteCharacter(){
        // we remove the ground module from the list
        GAME.level.removeGroundModule(this.ground);
    }
    
    // this function can be used for ground or ceilling detection
    public static checkCollision( ray : CANNON.Ray, vertice : CANNON.Vec3, angle : number = null,  padding_contact : number = -0.5, padding_emit : number = 0.1 ) : boolean{
        vertice = vertice.clone();
        let contact = vertice.clone();
        // we add padding to both vector
        vertice.y += padding_emit;
        contact.y += padding_contact;
        // we perform the raycast
        ray.intersectWorld( GAME.level.World, Util.createIRay( vertice, contact ) );
        // if we didn't specified an angle
        if( angle == null ){
            return ray.hasHit;
        }else{
            // if the raycast has hit
            if( ray.hasHit ){
                // we compare the hit normal to the vector up
                let normal = Util.getSupVec(ray.result.hitNormalWorld).angleTo(Sup.Math.Vector3.up());
                // if the angle from the normal to the vector up is lower than the angle we gave
                return(normal < angle);
            }
        }
        return false;
    }

}
