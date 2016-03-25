abstract class CharacterInput extends BaseInput {
    
    public ctrl : CharacterController;
    
    public init( controller : CharacterController ){
        super.init(controller);
    }
    
    public abstract getMouseDelta() : Sup.Math.Vector2;
    public abstract getFire1()      : boolean;
    public abstract getFire2()      : boolean;
    public abstract getMove()       : Sup.Math.Vector2;
    public abstract getJump()       : boolean;
    public abstract getCrounch()    : boolean;
    
}
