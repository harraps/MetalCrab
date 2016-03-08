class PlayerLook extends BaseLook {
    
    public update(){
        // we rotate the character based on the mouse delta
        let delta = this.ctrl.input.getMouseDelta();
        let controller = <PlayerController>this.ctrl;
        // we rotate the anchor horizontally
        this.ctrl.Anchor.rotateLocalEulerZ( delta.x * -controller.sensibility );
        this.angle.x += delta.x * -controller.sensibility;
        this.angle.x %= Util.TAU;
        
        // we rotate the camera vertically
        controller.Head.rotateLocalEulerX( delta.y * controller.sensibility );
        this.angle.y += delta.y * controller.sensibility;


        if( this.angle.y > Util.halfPI ){
            controller.Head.setLocalEulerX( Util.halfPI );
            this.angle.y = Util.halfPI;
        } else if( this.angle.y < -Util.halfPI ){
            controller.Head.setLocalEulerX( -Util.halfPI );
            this.angle.y = -Util.halfPI;
        }
    }
    
}
