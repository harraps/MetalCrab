abstract class AbstractWeapon extends Sup.Behavior implements IAttribute{
    
    public ctrl : BaseController;
    protected inventory : PlayerInventory;
    
    public name   : string;
    public ammo   : string;
    public conso  : number =  0;
    public rate   : number = 10; // number of fire possible per second
    
    protected timer   : number;
    protected emitter : Sup.Actor;
    protected effect  : Effect;
    
    public awake(){
        this.rate  = Sup.Game.getFPS() / this.rate;
        this.timer = 0;
        this.effect = this.actor.getChild("effect").getBehavior(Effect);
    }
    public init( controller : BaseController, emitter? : Sup.Actor ){
        this.ctrl = controller;
        if( this.ctrl instanceof PlayerController ){
            this.inventory = (<PlayerController>this.ctrl).inventory;
        }
    }
    
    public get Name() : string{
        return this.name;
    }
    public get AmmoType() : string{
        return this.ammo;
    }
    
    public update(){
        // if the counters are over 0, we decrement the counter
        if( this.timer > 0 ) --this.timer;
    }
    protected resetTimer(){
        this.timer = this.rate;
    }
    
    public abstract fire  (fire : IFireInput);
    
    public removeAmmo() : boolean {
        // if the character has an inventory
        if(this.inventory != null){
            // we try to remove ammo
            // if we cannot remove ammo, we stop right here
            if(!this.inventory.removeAmmo(this.ammo, this.conso)) return false;
        } // we have removed ammo if necessary
        return true;
    }
}
