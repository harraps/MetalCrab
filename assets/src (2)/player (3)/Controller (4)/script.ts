class PlayerController extends Sup.Behavior {
    
    protected body     : CANNON.Body;
    protected collider : CANNON.Cylinder;
    protected anchor   : Sup.Actor;
    protected camera   : Sup.Actor;
    
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
    public get Camera() : Sup.Actor {
        return this.camera;
    }
    
    // attributes Input
    public keyboard : string = "QWERTY"; // the keyboard layout of the player

    // attributes Status
    public health : number = 100; // health of the player
    public regen  : number = 10;   // how much health does the player regain in sec
    
    // attributes Look
    public sensibility : number = 0.5; // sensibility of the mouse
    
    // attributes Move
    public speed      : number = 15; // speed of the player
    public jump       : number = 30; // jump force of the player
    public airControl : number = 0.8; // how much does the player regain movement control in the air
    
    // attributes Crounch
    public crounchHeight : number = 0.9; // height of the player when crounched
    public crounchSpeed  : number = 5; // the speed of the player when crounched

    public input   : PlayerInput   = new PlayerInput  ();
    public status  : PlayerStatus  = new PlayerStatus ();
    public look    : PlayerLook    = new PlayerLook   ();
    public move    : PlayerMove    = new PlayerMove   ();
    public ground  : PlayerGround  = new PlayerGround ();
    public crounch : PlayerCrounch = new PlayerCrounch();
    public wall    : PlayerWall    = new PlayerWall   ();
    
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
        let deltaTime = 100 / Sup.Game.getFPS(); // in 100 fps
        this.regen        /= Sup.Game.getFPS(); // in second
        this.sensibility  *= deltaTime;
        this.speed        *= deltaTime;
        this.airControl   *= deltaTime;
        this.crounchSpeed *= deltaTime;
        
        // we recover the elements of the player
        this.body     = this.actor.cannonBody.body;
        this.collider = <CANNON.Cylinder>this.body.shapes[0]; // our player should only have one cylindrical collider
        this.anchor   = this.actor.getChild("anchor");
        this.camera   = this.actor.getChild("camera");
        
        // we initialize each module of the player
        this.input  .init(this);
        this.status .init(this);
        this.look   .init(this);
        this.move   .init(this);
        this.ground .init(this);
        this.crounch.init(this);
        this.wall   .init(this);
        
        // we setup the collider of the player
        this.body.material = PLAYERMATERIAL;
        
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
    }
    
    update() {
        this.input  .update();
        this.status .update();
        this.ground .update();
        this.look   .update();
        this.move   .update();
        this.crounch.update();
        this.wall   .update();
        // call after the velocities have been applied !
        this.ground.updatePlatform();
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
Sup.registerBehavior(PlayerController);


abstract class PlayerAttribute {
    protected ctrl : PlayerController;

    public init( controller : PlayerController ){
        this.ctrl = controller;
    }
    public update(){
        
    }
}
