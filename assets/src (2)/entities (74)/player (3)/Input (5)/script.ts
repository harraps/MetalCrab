class PlayerInput extends CharacterInput {
    
    public ctrl : PlayerController;
    
    protected inputs;
    
    protected useMouse    : boolean;
    protected isMouseLock : boolean;
    
    protected jumpCounter : number;
    
    public init(controller : PlayerController){
        super.init(controller);
        
        // we create a array to store our input values
        this.inputs = [];
        this.resetInputs();
        
        // we lock the mouse of the player
        Sup.Input.lockMouse();
        this.useMouse    = true;
        this.isMouseLock = true;
        
        // we set the jump counter to 0 : the player doesn't want to jump right when spawned
        this.jumpCounter = 0;
    }
    
    public update(){
        // we set each input value to false
        this.resetInputs();
        
        // complex inputs
        this.updateLook();
        this.updateMove();
        this.updateJump();
        
        // hold the button down
        this.inputs["crounch"  ] = GAME.input.isInputDown("crounch");
        this.inputs["fire1"    ] = GAME.input.isInputDown("fire1"  );
        this.inputs["fire2"    ] = GAME.input.isInputDown("fire2"  );
        
        // press the button once
        this.inputs["reload1"  ] = GAME.input.wasInputJustPressed("reload1"  );
        this.inputs["reload2"  ] = GAME.input.wasInputJustPressed("reload2"  );
        this.inputs["use"      ] = GAME.input.wasInputJustPressed("use"      );
        this.inputs["inventory"] = GAME.input.wasInputJustPressed("inventory");
    }
    
    private updateLook(){
        // for each input we change the direction of the vector2
        if( GAME.input.isInputDown("lookUp"   ) ) ++this.inputs["look"].y;
        if( GAME.input.isInputDown("lookDown" ) ) --this.inputs["look"].y;
        if( GAME.input.isInputDown("lookLeft" ) ) --this.inputs["look"].x;
        if( GAME.input.isInputDown("lookRight") ) ++this.inputs["look"].x;
    }
    private updateMove(){
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
        // we update jump input
        if( GAME.input.wasInputJustPressed("jump") ){
            this.jumpCounter = 1; // the player wants to jump
        }
        if( this.jumpCounter > 0 ){
            this.jumpCounter -= 0.1;
            this.inputs["jump"] = true;
        }
    }
    
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
    public getFire1() : boolean{
        return this.inputs["fire1"];
    }
    public getFire2() : boolean{
        return this.inputs["fire2"];
    }
    public getReload1() : boolean {
        return this.inputs["reload1"];
    }
    public getReload2() : boolean {
        return this.inputs["reload2"];
    }
    
    protected resetInputs(){
        // axis based inputs
        this.inputs["look"] = this.useMouse ? Sup.Input.getMouseDelta() : new Sup.Math.Vector2();
        this.inputs["move"] = new Sup.Math.Vector2();
        
        // boolean inputs
        this.inputs["jump"     ] = false;
        this.inputs["crounch"  ] = false;
        this.inputs["fire1"    ] = false;
        this.inputs["fire2"    ] = false;
        this.inputs["reload1"  ] = false;
        this.inputs["reload2"  ] = false;
        this.inputs["use"      ] = false;
        this.inputs["inventory"] = false;
    }
}
