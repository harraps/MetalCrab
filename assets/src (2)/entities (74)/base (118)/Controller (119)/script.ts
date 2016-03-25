abstract class BaseController extends Sup.Behavior {
    
    public input   : BaseInput;
    public status  : BaseStatus;
    public look    : BaseLook;
    
    // attributes Status
    public health : number = 100;  // health of the entity
    // attributes Look
    public sensibility : number = 0.5; // sensibility of the mouse
    
    protected body     : CANNON.Body;
    protected anchor   : Sup.Actor;
    protected head     : Sup.Actor;
    
    public get Body() : CANNON.Body {
        return this.body;
    }
    public get Anchor() : Sup.Actor {
        return this.anchor;
    }
    public get Head() : Sup.Actor {
        return this.head;
    }

    awake() {
        // we recalculate each attributes based on time
        this.sensibility *= Util.deltaTime;
        
        // we recover the elements of the player
        this.body   = this.actor.cannonBody.body;
        this.anchor = this.actor.getChild("anchor");
        this.head   = this.actor.getChild("head");
    }

    update() {
        
    }
}

interface IAttribute {
    ctrl : BaseController;
    init( controller : BaseController );
    update();
}