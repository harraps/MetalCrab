class PlayerLook extends PlayerAttribute {
    
    protected angle  : Sup.Math.Vector2;
    
    // GETTER
    public get Angle(): Sup.Math.Vector2{
        return this.angle;
    }

    public init( controller : PlayerController ){
        super.init(controller);
        this.angle  = new Sup.Math.Vector2();
    }
    
    public update(){
        // we rotate the character based on the mouse delta
        let delta = this.ctrl.input.getMouseDelta();

        // we rotate the anchor horizontally
        this.ctrl.Anchor.rotateLocalEulerZ( delta.x * -this.ctrl.sensibility );
        this.angle.x += delta.x * -this.ctrl.sensibility;
        this.angle.x %= Util.TAU;
        
        // we rotate the camera vertically
        this.ctrl.Camera.rotateLocalEulerX( delta.y * this.ctrl.sensibility );
        this.angle.y += delta.y * this.ctrl.sensibility;


        if( this.angle.y > Util.halfPI ){
            this.ctrl.Camera.setLocalEulerX( Util.halfPI );
            this.angle.y = Util.halfPI;
        } else if( this.angle.y < -Util.halfPI ){
            this.ctrl.Camera.setLocalEulerX( -Util.halfPI );
            this.angle.y = -Util.halfPI;
        }
    }

    public addRotation( angle : number ){
        angle %= Util.TAU;
        // we add rotation to our player
        this.ctrl.Anchor.rotateLocalEulerZ(angle);
        this.angle.x += angle;
    }
    
}
