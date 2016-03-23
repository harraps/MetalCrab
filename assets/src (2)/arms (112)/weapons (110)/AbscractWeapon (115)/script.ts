abstract class AbscractWeapon extends BaseAttribute {
    
    public constructor( controller : BaseController ){
        super(controller);
    }
    
    // set the model of the gun and put it at the right location
    public abstract setGunModel        ( path : string );
    public abstract setFlareModel      ( path : string, color : string );
    public abstract setProjectileModel ( path : string, color : string );
    public abstract setImpactModel     ( path : string, color : string );
    
    public update() {
        
    }
    
    public abstract fire();
}
