abstract class CharacterInput extends BaseInput {
    
    public ctrl : CharacterController;
    
    public init( controller : CharacterController ){
        super.init(controller);
    }
    
    public abstract getLook   () : Sup.Math.Vector2;
    public abstract getArm1   () : IArm;
    public abstract getMove   () : Sup.Math.Vector2;
    public abstract getJump   () : boolean;
    public abstract getCrounch() : boolean;
    
}
