class ApplyTexture extends Sup.Behavior {
    
    public texture   : string;
    public thisActor : boolean = true;
    public actors    : string;

    start() {
        if( this.texture != null ){
            new Sup.SpriteRenderer(this.actor, this.texture);
            if( this.thisActor ){
                this.applyTexture(this.actor);
            }
            // if we specified a list of actors to apply the texture too
            if( this.actors != null ){
                // we parse the list of paths
                let paths = ApplyTexture.parseActors( this.actors );
                // and for each path
                for( let path of paths ){
                    // we apply the texture to the actor
                    this.applyTexture(this.actor.getChild(path));
                }
            }
            // we don't need the texture anymore
            this.actor.spriteRenderer.destroy();
        }
        // we don't need this behavior anymore
        this.destroy();
    }
    
    // apply the texture to the given actor
    private applyTexture( actor : Sup.Actor ){
        if( actor != null )
            if( actor.modelRenderer != null && this.actor.spriteRenderer != null )
                (<any>actor.modelRenderer).__inner.threeMesh.material = (<any>this.actor.spriteRenderer).__inner.threeMesh.material;
    }
    
    // parse a string representing a list of actors
    // said list as the following pattern :
    // root1;root2/child1;root3/child2/child3
    private static parseActors( actors : string ) : string[] {
        let list = actors.split(";");
        return list;
    }
}
Sup.registerBehavior(ApplyTexture);
