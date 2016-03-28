abstract class CrabInput extends CharacterInput {
    
    public ctrl : CrabController;
    
    public init( controller : CrabController ){
        super.init(controller);
    }
    
    public abstract getLook   () : Sup.Math.Vector2;
    public abstract getArm1   () : IArm;
    public abstract getArm2   () : IArm;
    public abstract getFire3  () : boolean;
    public abstract getMove   () : Sup.Math.Vector2;
    public abstract getJump   () : boolean;
    public abstract getCrounch() : boolean;
    
}