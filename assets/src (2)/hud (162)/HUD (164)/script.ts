class HUD extends Sup.Behavior {
    
    public path : string = "Player";
    protected player : PlayerController;
    
    protected panel   : Sup.Actor;
    protected weaponL : Sup.Actor;
    protected weaponR : Sup.Actor;
    
    
    public start() {
        this.player = Sup.getActor(this.path).getBehavior(PlayerController);
        this.panel = this.actor.getChild("panel");
        
        
    }
    public update() {
        this.updateBG();
    }
    
    public updateBG(){
        let ortho = this.actor.camera.getOrthographicScale()*0.5;
        let ratio = this.actor.camera.getWidthToHeightRatio();
        ortho *= ratio;
        this.panel.setLocalScale({x:ortho, y:ortho, z:1});
    }
}
Sup.registerBehavior(HUD);
