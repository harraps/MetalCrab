class Explosion extends Sup.Behavior {
    
    public maxExpand  : number = 5;
    public expandTime : number = 2;
    public dissipTime : number = 1;
    
    private timer : number;
    private expansion   : number;
    private dissipation : number;
    
    protected expandRate : number;
    protected dissipRate : number;

    awake() {
        // we adapt the time based variables
        this.expandTime *= DELTATIME;
        this.dissipTime *= DELTATIME;
        // we 
        this.timer = this.expandTime + this.dissipTime;
        this.expansion = 0.001;
        this.dissipation = 1;
        
        this.expandRate = this.maxExpand / this.expandTime;
        this.dissipRate = 1 / this.dissipTime;
        
        this.impluse();
    }

    update() {
        // if the timer ended, the object is completely destroyed
        if( this.timer < 0 ){
            this.actor.destroy();
        }
        // if we're still in expansion phase
        if( this.timer > this.dissipTime ){
            // we update the expansion variable
            this.expansion += this.expandRate;
            // we update the size of the model
            this.actor.setLocalScale( this.expansion );
        }else{ // we're in dissipation phase
            // we update the dissipation variable
            this.dissipation -= this.dissipRate;
            // we update the opacity of our explosion
            this.actor.modelRenderer.setOpacity( this.dissipation );
        }
    }

    protected impluse() {
        
    }
}
Sup.registerBehavior(Explosion);
