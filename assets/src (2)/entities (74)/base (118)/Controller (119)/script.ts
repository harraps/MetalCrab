abstract class BaseController extends Sup.Behavior {
    
    public input   : BaseInput;
    public status  : BaseStatus;
    public look    : BaseLook;
    
    // attributes Status
    public health : number = 100;  // health of the entity
    // attributes Look
    public sensibility : number = 0.5; // sensibility of the mouse
    
    public body     : CANNON.Body;
    public anchor   : Sup.Actor;
    public head     : Sup.Actor;
    public emitter1 : Sup.Actor;

    public awake() {
        // we recalculate each attributes based on time
        this.sensibility *= Util.deltaTime;
        
        // we recover the elements of the player
        this.body   = this.actor.cannonBody.body;
        this.anchor = this.actor.getChild("anchor");
        this.head   = this.actor.getChild("head");
    }
    public update() {}
}

interface IAttribute {
    ctrl : BaseController;
    init( controller : BaseController );
    update();
}