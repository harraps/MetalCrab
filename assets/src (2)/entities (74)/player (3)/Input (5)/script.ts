class PlayerInput extends CharacterInput {
    
    public ctrl : PlayerController;
    
    protected inputs;
    
    protected useMouse    : boolean;
    protected isMouseLock : boolean;
    
    protected jumpCounter : number;
    
    public getLook() : Sup.Math.Vector2{
        return this.inputs["look"].clone();
    }
    public getMove() : Sup.Math.Vector2{
        return this.inputs["move"].clone();
    }
    public getJump() : boolean{
        this.jumpCounter = 0; // the player just performed a jump
        return this.inputs["jump"];
    }
    public getCrounch() : boolean{
        return this.inputs["crounch"];
    }
    public getFire1() : IFireInput{
        return this.inputs["fire1"];
    }
    public getFire2() : IFireInput{
        return this.inputs["fire2"];
    }
    public getFire3() : IFireInput{
        return this.inputs["fire3"];
    }
    public getSwitch() : number {
        return this.inputs["switch"];
    }
    public getUse() : boolean{
        return this.inputs["use"];
    }
    public getInventory() : boolean{
        return this.inputs["inventory"];
    }

    public init(controller : PlayerController){
        super.init(controller);
        
        // we create a array to store our input values
        this.inputs = [];
        
        // we lock the mouse of the player
        Sup.Input.lockMouse();
        this.useMouse    = true;
        this.isMouseLock = true;
        
        // we set the jump counter to 0 : the player doesn't want to jump right when spawned
        this.jumpCounter = 0;
        
        // we initialize object typed inputs holder
        this.inputs["look"] = new Sup.Math.Vector2();
        this.inputs["move"] = new Sup.Math.Vector2();
        this.inputs["fire1"] = {};
        this.inputs["fire2"] = {};
        this.inputs["fire3"] = {};
    }
    
    public update(){
        
        // complex inputs
        this.updateLook();
        this.updateMove();
        this.updateJump();
        this.updateArm(1);
        this.updateArm(2);
        this.updateArm(3);
        this.updateSwitch();
        
        this.inputs["crounch"  ] = GAME.input.isInputDown("crounch");
        this.inputs["use"      ] = GAME.input.wasInputJustPressed("use"      );
        this.inputs["inventory"] = GAME.input.wasInputJustPressed("inventory");
    }
    
    private updateLook(){
        // if we use the mouse, we want to recover the mouse delta
        this.inputs["look"] = this.useMouse ? Sup.Input.getMouseDelta() : new Sup.Math.Vector2();
        
        // for each input we change the direction of the vector2
        if( GAME.input.isInputDown("lookUp"   ) ) ++this.inputs["look"].y;
        if( GAME.input.isInputDown("lookDown" ) ) --this.inputs["look"].y;
        if( GAME.input.isInputDown("lookLeft" ) ) --this.inputs["look"].x;
        if( GAME.input.isInputDown("lookRight") ) ++this.inputs["look"].x;
    }
    private updateMove(){
        // we reset the move vector rather than creating a new one (0,0)
        this.inputs["move"].set(0,0);
        
        // for each input we change the direction of the vector2
        if( GAME.input.isInputDown("forward" ) ) ++this.inputs["move"].y;
        if( GAME.input.isInputDown("backward") ) --this.inputs["move"].y;
        if( GAME.input.isInputDown("left"    ) ) --this.inputs["move"].x;
        if( GAME.input.isInputDown("right"   ) ) ++this.inputs["move"].x;
        
        // if the player is going in a direction
        if( this.inputs["move"].x !== 0 || this.inputs["move"].y !== 0 ){
            // we normalize the vector
            this.inputs["move"].normalize();
        }
    }
    private updateJump(){
        // we assume the player is not jumping
        this.inputs["jump"] = false;
        
        // we update jump input
        if( GAME.input.wasInputJustPressed("jump") ){
            this.jumpCounter = 1; // the player wants to jump
        }
        if( this.jumpCounter > 0 ){
            this.jumpCounter -= 0.1;
            this.inputs["jump"] = true;
        }
    }
    private updateArm( a : number ){
        let arm = "arm"+a;
        this.inputs[arm].fire  = GAME.input.isInputDown        ("fire"+a);
        this.inputs[arm].pulse = GAME.input.wasInputJustPressed("fire"+a);
        //this.inputs[arm].reload = GAME.input.wasInputJustPressed("reload"+a);
    }
    private updateSwitch(){
        this.inputs["switch"] = 0;
        if( GAME.input.isInputDown("switchUp"  ) ) ++this.inputs["switch"];
        if( GAME.input.isInputDown("switchDown") ) --this.inputs["switch"];
    }
}
