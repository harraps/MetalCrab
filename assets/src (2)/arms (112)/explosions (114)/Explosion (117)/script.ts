class Explosion extends Sup.Behavior {
    
    public timer      : number = 3;
    public expandMax  : number = 5;
    public expandTime : number = 1;
    public dissipTime : number = 1;
    
    protected expandRate : number;
    protected dissipRate : number;
    
    awake() {
        // we adapt the time based variables
        this.timer      *= Sup.Game.getFPS();
        this.expandTime *= Sup.Game.getFPS();
        this.dissipTime *= Sup.Game.getFPS();
        // we caculate the expand rate and the dissipation rate
        this.expandRate = this.expandMax / this.expandTime;
        this.dissipRate = 1 / this.dissipTime;
    }

    update() {
        // expand effect
        --this.expandTime;
        if( this.expandTime > 0 ){ // expand time is not over yet
            this.actor.setLocalScale( this.expandRate + this.actor.getLocalScaleX() );
        }
        // main timer
        --this.timer;
        if( this.timer < 0 ){ // timer is over
            this.actor.destroy();
        }else if( this.timer < this.dissipTime ){ // if we're in dissipation phase
            this.actor.modelRenderer.setOpacity( this.dissipRate + this.actor.modelRenderer.getOpacity() );
        }
    }
}
Sup.registerBehavior(Explosion);
