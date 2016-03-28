abstract class BaseInput implements IAttribute {

    public ctrl : BaseController;
    
    public init( controller : BaseController ){
        this.ctrl = controller;
    }
    
    public update(){}
    
    public abstract getLook () : Sup.Math.Vector2;
    public abstract getFire1() : boolean;
}
