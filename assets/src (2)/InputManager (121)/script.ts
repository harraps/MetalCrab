class InputManager {
    
    public static names : string[] = [
        // look
        "lookUp",   "lookDown",
        "lookLeft", "lookRight",
        
        // movement
        "forward", "backward",
        "left",    "right",
        "jump",    "crounch",
        
        // weapons
        "fire1",   "fire2",
        "reload1", "reload2",
        
        // interactions
        "use", "inventory"
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
        // mouse controls
        this.mouse["fire1"] = 0;
        this.mouse["fire2"] = 1;
        
        // keyboard controls 1
        this.keys1["forward"  ] = "W";
        this.keys1["backward" ] = "S";
        this.keys1["left"     ] = "A";
        this.keys1["right"    ] = "D";
        this.keys1["jump"     ] = "SPACE";
        this.keys1["crounch"  ] = "SHIFT";
        this.keys1["reload1"  ] = "Q";
        this.keys1["reload2"  ] = "E";
        this.keys1["use"      ] = "F";
        this.keys1["inventory"] = "TAB";
        
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
    
    public isInputDown( input : string ) : boolean{
        if( this.mouse[input] != null ) // if the control exist
            if( Sup.Input.isMouseButtonDown(this.mouse[input]) ) // if the button is down
                return true; // the input is down
        if( this.keys1[input] != null )
            if( Sup.Input.isKeyDown(this.keys1[input]) )
                return true;
        if( this.keys2[input] != null )
            if( Sup.Input.isKeyDown(this.keys2[input]) )
                return true;
        return false;
    }
    public wasInputJustPressed( input : string ) : boolean{
        if( this.mouse[input] != null ) // if the control exist
            if( Sup.Input.wasMouseButtonJustPressed(this.mouse[input]) ) // if the button was just pressed
                return true; // the input was just pressed
        if( this.keys1[input] != null )
            if( Sup.Input.wasKeyJustPressed(this.keys1[input]) )
                return true;
        if( this.keys2[input] != null )
            if( Sup.Input.wasKeyJustPressed(this.keys2[input]) )
                return true;
        return false;
    }
    public wasInputJustReleased( input : string ) : boolean{
        if( this.mouse[input] != null ) // if the control exist
            if( Sup.Input.wasMouseButtonJustReleased(this.mouse[input]) ) // if the button was just released
                return true; // the input was just released
        if( this.keys1[input] != null )
            if( Sup.Input.wasKeyJustReleased(this.keys1[input]) )
                return true;
        if( this.keys2[input] != null )
            if( Sup.Input.wasKeyJustReleased(this.keys2[input]) )
                return true;
        return false;
    }

    private checkInput( array : number[]|string[], call : Function, input : string ) : boolean{
        if( array[input] != null ){
            return call( array[input] );
        }
    }

}