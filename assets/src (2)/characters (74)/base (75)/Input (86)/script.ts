abstract class BaseInput extends BaseAttribute {
    
    public getMouseDelta() : Sup.Math.Vector2{
        return Sup.Input.getMouseDelta();
    }
    public abstract getFire1()   : boolean;
    public abstract getFire2()   : boolean;
    public abstract getMove()    : Sup.Math.Vector2;
    public abstract getJump()    : boolean;
    public abstract getCrounch() : boolean;
    
}
