abstract class BaseController extends Sup.Behavior {
    
    protected body     : CANNON.Body;
    protected collider : CANNON.Cylinder;
    protected anchor   : Sup.Actor;
    //protected head     : Sup.Actor;
    
    public get Body() : CANNON.Body {
        return this.body;
    }
    public get Collider() : CANNON.Cylinder {
        return this.collider;
    }
    public get Vertices() : CANNON.Vec3[] {
        return this.collider.vertices;
    }
    public get Anchor() : Sup.Actor {
        return this.anchor;
    }
    /*public get Head() : Sup.Actor {
        return this.head;
    }*/

    // attributes Status
    public health : number = 100;  // health of the player
    
    // attributes Move
    public speed      : number = 15;  // speed of the player
    public jump       : number = 30;  // jump force of the player
    public airControl : number = 0.8; // how much does the player regain movement control in the air
    
    // attributes Ground
    public steepSlope : number = 50; // how steep is the ground the player can walk on
    
    // attributes Crounch
    public crounchHeight : number = 0.9; // height of the player when crounched
    public crounchSpeed  : number = 5;   // the speed of the player when crounched
    
    public input   : BaseInput;
    public status  : BaseStatus;
    public look    : BaseLook;
    public move    : BaseMove;
    public ground  : BaseGround;
    public crounch : BaseCrounch;
    
    // we keep track of the vertices at the center of the collider
    private centerVertices : CANNON.Vec3[];
    // GETTER
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
    
    awake() {
        // we recalculate each attributes based on time
        this.speed        *= DELTATIME;
        this.airControl   *= DELTATIME;
        this.crounchSpeed *= DELTATIME;
        this.steepSlope   *= Math.PI/180; // conversion from degree to radian
        
        // we recover the elements of the player
        this.body     = this.actor.cannonBody.body;
        this.collider = <CANNON.Cylinder>this.body.shapes[0]; // our player should only have one cylindrical collider
        this.anchor   = this.actor.getChild("anchor");
        //this.head     = this.actor.getChild("head");
        
        // we setup the collider of the player
        this.body.material = BASEMATERIAL;
        
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
    
    // this function allow us to change the height of the collider (for crounching)
    public changeHeight( height : number ){
        // we only change the vertices at the bottom
        this.centerVertices[1].z = height;
        for( let i=0; i<this.collider.vertices.length; i += 2 ){
            this.collider.vertices[i].z = height;
        }
    }

}
abstract class BaseAttribute {
    protected ctrl : BaseController;

    public constructor( controller : BaseController ){
        this.ctrl = controller;
    }
    public update(){}
}
