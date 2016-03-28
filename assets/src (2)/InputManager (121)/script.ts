class InputManager {
    
    public static names : string[] = [
        // look
        "lookUp"  ,"lookDown" ,
        "lookLeft","lookRight",
        
        // movement
        "forward","backward",
        "left"   ,"right"   ,
        "jump"   ,"crounch" ,
        
        // arms
        "fire1"  ,"fire2"  ,"fire3",
        "reload1","reload2",
        
        // interactions
        "switchUp","switchDown",
        "use"     ,"inventory"
    ];
    
    public mouse : number[];
    public keys1 : string[];
    public keys2 : string[];
    
    public constructor( layout? : string ){
        // we create our arrays
        this.mouse = [];
        this.keys1 = [];
        this.keys2 = [];
        
        this.reset(layout);
    }
    
    public reset( layout? : string ){
        // look controls
        this.keys1["lookUp"   ] = "I";
        this.keys1["lookDown" ] = "K";
        this.keys1["lookLeft" ] = "J";
        this.keys1["lookRight"] = "L";
        
        // move controls
        this.keys1["forward" ] = "W";
        this.keys1["backward"] = "S";
        this.keys1["left"    ] = "A";
        this.keys1["right"   ] = "D";
        this.keys1["jump"    ] = "SPACE";
        this.keys1["crounch" ] = "SHIFT";
        
        // arms controls
        this.mouse["fire1"] = 0;
        this.mouse["fire2"] = 1;
        this.mouse["fire3"] = 2;
        this.keys1["reload1"] = "Q";
        this.keys1["reload2"] = "E";
        
        // interaction controls
        this.mouse["switchUp"  ] = 5;
        this.mouse["switchDown"] = 6;
        this.keys1["use"       ] = "F";
        this.keys1["inventory" ] = "TAB";
        
        // we change the input based on the selected keyboard layout
        switch( layout ){
            case "QWERTY": // English
            case "QWERTZ": // German
                break;
            case "AZERTY": // French
                this.keys1["forward"] = "Z";
                this.keys1["left"   ] = "Q";
                this.keys1["reload1"] = "A";
                break;
            case "QZERTY": // Italian
                this.keys1["forward"] = "Z";
            case "ĄŽERTY": // Lithuanian
                this.keys1["forward"] = "Ž";
                this.keys1["use"    ] = "Š";
        }
    }
    
    public setInput( array : number, input : string, control : number|string ){
        switch( array ){
            case 0 : this.mouse[input] = control; break;
            case 1 : this.keys1[input] = control; break;
            case 2 : this.keys2[input] = control; break;
        }
    }
    
    // return true if the input is down wherever it is a mouse button or one of the two possible keys
    public isInputDown( input : string ) : boolean{
        // we check each array with the right function
        if( InputManager.checkInput(this.mouse, Sup.Input.isMouseButtonDown, input) ) return true;
        if( InputManager.checkInput(this.keys1, Sup.Input.isKeyDown, input) ) return true;
        if( InputManager.checkInput(this.keys2, Sup.Input.isKeyDown, input) ) return true;
        return false;
    }
    
    // return true if the input was just pressed wherever it is a mouse button or one of the two possible keys
    public wasInputJustPressed( input : string ) : boolean{
        // we check each array with the right function
        if( InputManager.checkInput(this.mouse, Sup.Input.wasMouseButtonJustPressed, input) ) return true;
        if( InputManager.checkInput(this.keys1, Sup.Input.wasKeyJustPressed, input) ) return true;
        if( InputManager.checkInput(this.keys2, Sup.Input.wasKeyJustPressed, input) ) return true;
        return false;
    }
    
    // return true if the input was just released wherever it is a mouse button or one of the two possible keys
    public wasInputJustReleased( input : string ) : boolean{
        // we check each array with the right function
        if( InputManager.checkInput(this.mouse, Sup.Input.wasMouseButtonJustReleased, input) ) return true;
        if( InputManager.checkInput(this.keys1, Sup.Input.wasKeyJustReleased, input) ) return true;
        if( InputManager.checkInput(this.keys2, Sup.Input.wasKeyJustReleased, input) ) return true;
        return false;
    }
    
    // check if input is set and call the function on the input
    private static checkInput( array : number[]|string[], call : Function, input : string ) : boolean{
        if( array[input] != null ){
            return call( array[input] );
        }
    }

}