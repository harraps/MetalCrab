class Arms extends Sup.Behavior {
    
    public path : string = "Player";

    protected player : PlayerController;
    
    protected handL : IHand;
    protected handR : IHand;
    
    private height : number;
    
    public awake(){
        // we init each hand
        this.handL = {
            hand : null,
            models : [],
            hold : null,
            angle : 0
        };
        this.handR = {
            hand : null,
            models : [],
            hold : null,
            angle : 0
        };
    }
    public start() {
        this.player = Sup.getActor(this.path).getBehavior(PlayerController);
        // we recover the hands of the player
        this.handL.hand = this.actor.getChild("left" );
        this.handR.hand = this.actor.getChild("right");
        // for each weapon we have declared
        this.initWeaponsList(true );
        this.initWeaponsList(false);
        this.height = this.handL.hand.getLocalY();
    }
    
    private initWeaponsList ( left : boolean ){
        let hand = left ? this.handL : this.handR;
        for( let name of WeaponManager.humanWeapons ){
            // we recover the model
            hand.models[name] = hand.hand.getChild(name);
            // we make it invisible
            hand.models[name].setVisible(false);
        }
    }
    
    public update() {
        this.updateHand(true );
        this.updateHand(false);
    }
    
    private updateHand( left : boolean ){
        // we recover the name of the weapons currently hold by the player
        let hold = left ? this.player.inventory.LeftName : this.player.inventory.RightName;
        let hand = left ? this.handL : this.handR;
        // if the player has switched of weapon
        if( hand.hold != hold ){
            this.switchWeapon(hold, left);
        }
    }
    
    private switchWeapon( newWeapon : string, left : boolean ){
        // we recover the hand we want
        let hand = left ? this.handL : this.handR;
        // we mask the old weapon, show the new one
        hand.models[hand.hold].setVisible(false);
        hand.models[newWeapon].setVisible(true );
        // we keep track of the currently hold weapon
        hand.angle = -Util.halfPI;
        hand.hand.setLocalEulerX(hand.angle);
        hand.hold = newWeapon;
    }
    
    private rotateHand( left : boolean ){
        let hand  = left ? this.handL  : this.handR;
        //let angle = left ? this.angleL : this.angleR;
        let delta = 0.1;
        if( hand.angle < 0 ){
            hand.hand.rotateEulerX(delta);
            hand.angle += delta;
            if( hand.angle > 0 ){
                hand.hand.setLocalEulerX(0);
                hand.angle = 0;
            }
        }
    }
}
Sup.registerBehavior(Arms);

interface IHand{
    hand   : Sup.Actor;
    models : Sup.Actor[];
    hold   : string;
    angle  : number;
}