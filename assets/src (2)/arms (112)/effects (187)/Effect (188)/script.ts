class Effect extends Sup.Behavior {
    
    // how long does it take for the effect to disappear in seconds
    public dissipation : number = 3;
    
    protected defSize : Sup.Math.Vector3;
    protected coeff   : number;
    
    public awake() {
        this.defSize = this.actor.getLocalScale();
        this.dissipation *= Sup.Game.getFPS();
        this.coeff = 1/this.dissipation; 
    }

    public update() {
        // as long as the effect is not completly hidden
        if( this.actor.getLocalScaleZ() > 0 ){
            let scale = this.actor.getLocalScale();
            // we reduce the size of our scale and we cap the values if necessary
            scale.x -= this.coeff; if(scale.x < 0) scale.x = 0;
            scale.y -= this.coeff; if(scale.y < 0) scale.y = 0;
            scale.z -= this.coeff; if(scale.z < 0) scale.z = 0;
            // we apply the new scale
            this.actor.setLocalScale( scale );
            // play an animation on extended behaviors
            this.animation();
        }else{
            this.actor.setVisible(false);
        }
    }
    
    // extend to play more animations
    protected animation(){}
    
    public show() {
        this.actor.setVisible(true);
        this.actor.setLocalScale(this.defSize);
    }
}
Sup.registerBehavior(Effect);
