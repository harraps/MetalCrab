class PlayerController extends BaseController {
    
    protected head   : Sup.Actor;
    
    public get Head() : Sup.Actor {
        return this.head;
    }
    
    // attributes Input
    public keyboard : string = "QWERTY"; // the keyboard layout of the player
    
    // attributes Look
    public sensibility : number = 0.5; // sensibility of the mouse

    public wall : PlayerWall;
    
    awake() {
        super.awake();
        // we recalculate each attributes based on time
        let deltaTime = 100 / Sup.Game.getFPS(); // in 100 fps
        this.sensibility  *= deltaTime;
        
        // we recover the elements of the player
        this.head     = this.actor.getChild("head");
        
        // we initialize each module of the player
        this.input   = new PlayerInput (this);
        this.status  = new PlayerStatus(this);
        this.look    = new PlayerLook  (this);
        this.move    = new BaseMove    (this);
        this.ground  = new BaseGround  (this);
        this.crounch = new BaseCrounch (this);
        this.wall    = new PlayerWall  (this);
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
    
}
Sup.registerBehavior(PlayerController);
