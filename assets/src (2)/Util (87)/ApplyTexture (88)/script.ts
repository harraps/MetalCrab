class ApplyTexture extends Sup.Behavior {
    
    private static materials = []; // THREE.Material[]
    
    public texture   : string;
    public thisActor : boolean = true;
    public actors    : string;

    start() {
        if( this.texture != null ){
            // if the material is not already present in the list
            if( ApplyTexture.materials[this.texture] == null ){
                // we add a sprite to our actor
                new Sup.SpriteRenderer(this.actor, this.texture);
                // we store the material of the sprite
                ApplyTexture.materials[this.texture] = (<any>this.actor.spriteRenderer).__inner.threeMesh.material;
                // we don't need the sprite anymore
                this.actor.spriteRenderer.destroy();
            }
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
        }
        // we don't need this behavior anymore
        this.destroy();
    }
    
    // apply the texture to the given actor
    private applyTexture( actor : Sup.Actor ){
        if( actor != null ){
            if( actor.modelRenderer != null ){
                // we apply the material we have previously stored
                (<any>actor.modelRenderer).__inner.threeMesh.material = ApplyTexture.materials[this.texture];
            }
        }
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
