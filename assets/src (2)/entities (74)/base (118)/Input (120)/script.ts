// specified the interaction possible with a weapon
interface IFireInput {
    hold   : boolean; // trigger is down
    pulse  : boolean; // trigger   was just pressed
    //reload : boolean; // reloading was just pressed
}

abstract class BaseInput implements IAttribute {

    public ctrl : BaseController;
    
    public init( controller : BaseController ){
        this.ctrl = controller;
    }
    
    public update(){}
    
    public abstract getLook () : Sup.Math.Vector2;
    public abstract getFire1() : IFireInput;
}
