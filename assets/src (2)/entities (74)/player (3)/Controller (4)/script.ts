class PlayerController extends CharacterController {
    
    public input     : PlayerInput;
    public status    : PlayerStatus;
    public look      : PlayerLook;
    //public move    : CharacterMove;
    //public ground  : CharacterGround;
    //public crounch : CharacterCrounch;
    public inventory : PlayerInventory;
    public wall      : PlayerWall;
    
    // attributes Input
    public keyboard : string = "QWERTY"; // the keyboard layout of the player
    
    awake() {
        super.awake();
        
        // we create each module of the player
        this.input     = new PlayerInput     ();
        this.status    = new PlayerStatus    ();
        this.look      = new PlayerLook      ();
        this.move      = new CharacterMove   ();
        this.ground    = new CharacterGround ();
        this.crounch   = new CharacterCrounch();
        this.inventory = new PlayerInventory();
        this.wall      = new PlayerWall      ();
        
        // we initialize the modules
        this.input    .init(this);
        this.status   .init(this);
        this.look     .init(this);
        this.move     .init(this);
        this.ground   .init(this);
        this.crounch  .init(this);
        this.inventory.init(this);
        this.wall     .init(this);
    }
    
    update() {
        super.update();
        
        this.input    .update();
        this.status   .update();
        this.inventory.update();
        this.ground   .update();
        this.look     .update();
        this.move     .update();
        this.crounch  .update();
        this.wall     .update();
        // call after the velocities have been applied !
        this.ground.updatePlatform();
    }
    
}
Sup.registerBehavior(PlayerController);
