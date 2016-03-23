abstract class BaseLook extends BaseAttribute {
    
    protected angle  : Sup.Math.Vector2;
    
    // GETTER
    public get Angle(): Sup.Math.Vector2{
        return this.angle;
    }

    public constructor( controller : BaseController ){
        super(controller);
        this.angle  = new Sup.Math.Vector2();
    }
    
    public addRotation( angle : number ){
        angle %= Util.TAU;
        // we add rotation to our player
        this.ctrl.Anchor.rotateLocalEulerY(angle);
        this.angle.x += angle;
    }
}
