class PlayerLook extends BaseLook {
    
    public ctrl : PlayerController;
    
    public init( controller : PlayerController ){
        super.init(controller);
    }
    
    public update(){
        // we rotate the character based on the mouse delta
        let delta = this.ctrl.input.getMouseDelta();
        // we rotate the anchor horizontally
        this.ctrl.Anchor.rotateLocalEulerY( delta.x * -this.ctrl.sensibility );
        this.angle.x += delta.x * -this.ctrl.sensibility;
        this.angle.x %= Util.TAU;
        
        // we rotate the camera vertically
        this.ctrl.Head.rotateLocalEulerX( delta.y * this.ctrl.sensibility );
        this.angle.y += delta.y * this.ctrl.sensibility;


        if( this.angle.y > Util.halfPI ){
            this.ctrl.Head.setLocalEulerX( Util.halfPI );
            this.angle.y = Util.halfPI;
        } else if( this.angle.y < -Util.halfPI ){
            this.ctrl.Head.setLocalEulerX( -Util.halfPI );
            this.angle.y = -Util.halfPI;
        }
    }
    
}
