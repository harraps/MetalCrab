class Skybox extends Sup.Behavior {
    
    public path1 : string = "Player";
    public path2 : string = "anchor/head";
    
    private cam : Sup.Actor;
    
    public start() {
        let player = Sup.getActor(this.path1);
        this.cam   = player.getChild(this.path2);
    }

    public update() {
        this.actor.setOrientation(this.cam.getOrientation());
    }
}
Sup.registerBehavior(Skybox);
