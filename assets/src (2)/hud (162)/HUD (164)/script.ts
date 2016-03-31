class HUD extends Sup.Behavior {
    
    public path : string = "Player";
    protected player : PlayerController;
    
    protected bg : Sup.Actor;
    
    public start() {
        this.player = Sup.getActor(this.path).getBehavior(PlayerController);
        this.bg = this.actor.getChild("panel/bg");
        
        
    }
    public update() {
        
    }
    
    public updateBG(){
        let view = this.actor.camera.getViewport();
        let ratio = Sup.Game.getScreenRatio();
        
        Sup.log( view, ratio );
        
        this.bg.setLocalScaleX( view.width  );
        this.bg.setLocalScaleY( view.height );
    }
}
Sup.registerBehavior(HUD);
