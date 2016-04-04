abstract class AbstractWeapon implements IAttribute {
    
    public ctrl : BaseController;
    
    protected name : string;
    protected ammo : string;
    
    public init( controller : BaseController ){
        this.ctrl = controller;
    }
    
    public get Name() : string{
        return this.name;
    }
    public get AmmoType() : string{
        return this.ammo;
    }
    
    // set the model of the gun and put it at the right location
    /*public setGunModel( modelPath : string, anchorPath : string, rootPath : string = null ){
        let root = rootPath == null ? this.ctrl.actor : Sup.getActor(rootPath);
        // anchor to attach our weapon model to
        let anchor = root.getChild(anchorPath);
        
    }
    public abstract setFlareModel      ( path : string, color : string );
    public abstract setProjectileModel ( path : string, color : string );
    public abstract setImpactModel     ( path : string, color : string );*/
    
    public update() {
        
    }
    
    public abstract fire();
}