abstract class BaseInput extends BaseAttribute {
    
    public abstract getMouseDelta() : Sup.Math.Vector2;
    public abstract getFire1()      : boolean;
    public abstract getFire2()      : boolean;
    public abstract getMove()       : Sup.Math.Vector2;
    public abstract getJump()       : boolean;
    public abstract getCrounch()    : boolean;
    
}
