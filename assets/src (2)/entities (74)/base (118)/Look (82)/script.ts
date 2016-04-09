abstract class BaseLook implements IAttribute {
    
    public ctrl : BaseController;
    
    protected angle  : Sup.Math.Vector2;
    
    // GETTER
    public get Angle(): Sup.Math.Vector2{
        return this.angle;
    }

    public init( controller : BaseController ){
        this.ctrl = controller;
        this.angle  = new Sup.Math.Vector2();
    }
    
    public update(){
        // we rotate the character based on the mouse delta
        let delta = this.ctrl.input.getLook();
        // we rotate the anchor horizontally
        this.ctrl.anchor.rotateLocalEulerY( delta.x * -this.ctrl.sensibility );
        this.angle.x += delta.x * -this.ctrl.sensibility;
        this.angle.x %= Util.TAU;
        
        // we rotate the camera vertically
        this.ctrl.head.rotateLocalEulerX( delta.y * this.ctrl.sensibility );
        this.angle.y += delta.y * this.ctrl.sensibility;


        if( this.angle.y > Util.halfPI ){
            this.ctrl.head.setLocalEulerX( Util.halfPI );
            this.angle.y = Util.halfPI;
        } else if( this.angle.y < -Util.halfPI ){
            this.ctrl.head.setLocalEulerX( -Util.halfPI );
            this.angle.y = -Util.halfPI;
        }
    }
    
    public addRotation( angle : number ){
        angle %= Util.TAU;
        // we add rotation to our player
        this.ctrl.anchor.rotateLocalEulerY(angle);
        this.angle.x += angle;
    }
}
