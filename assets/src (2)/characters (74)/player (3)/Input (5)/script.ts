class PlayerInput extends BaseInput {
    
    public forward  : string = "W";
    public backward : string = "S";
    public left     : string = "A";
    public right    : string = "D";
    public jump     : string = "SPACE";
    public crounch  : string = "SHIFT";
    public fire1    : number = 0;
    public fire2    : number = 1;
    
    protected isMouseLock : boolean;
    
    protected jumpCounter : number;
    
    public constructor(controller : PlayerController){
        super(controller);
        
        // we change the input based on the selected keyboard layout
        switch( controller.keyboard ){
            case "QWERTY":
            case "QWERTZ":
                break;
            case "AZERTY":
                this.forward = "Z";
                this.left    = "Q";
                break;
            case "QZERTY":
                this.forward = "Z";
            case "ĄŽERTY":
                this.forward = "Ž";
        }
        
        // we lock the mouse of the player
        Sup.Input.lockMouse();
        this.isMouseLock = true;
        this.jumpCounter = 0;
    }
    
    public update(){
        if( Sup.Input.wasKeyJustPressed(this.jump) ){
            this.jumpCounter = 1;
        }
        if( this.jumpCounter > 0 ){
            this.jumpCounter -= 0.1;
        }
    }

    public getMouseDelta() : Sup.Math.Vector2{
        return Sup.Input.getMouseDelta();
    }
    public getFire1() : boolean{
        return Sup.Input.isMouseButtonDown(this.fire1);
    }
    public getFire2() : boolean{
        return Sup.Input.isMouseButtonDown(this.fire2);
    }
    
    public getMove() : Sup.Math.Vector2{
        // we create a 2D vector to recover the inputs of the player
        let move = new Sup.Math.Vector2();
        
        // for each input we change the direction of the vector2
        if(Sup.Input.isKeyDown(this.forward )) ++move.y;
        if(Sup.Input.isKeyDown(this.backward)) --move.y;
        if(Sup.Input.isKeyDown(this.left    )) --move.x;
        if(Sup.Input.isKeyDown(this.right   )) ++move.x;
        
        // if the player is going in a direction
        if( move.x !== 0 || move.y !== 0 ){
            // we normalize the vector
            move.normalize();
        }
        return move;
    }
    public getJump() : boolean{
        if( this.jumpCounter > 0 ){
            this.jumpCounter = 0;
            return true;
        }
        return false;
    }
    public getCrounch() : boolean{
        return Sup.Input.isKeyDown(this.crounch);
    }
    
    
    

}
