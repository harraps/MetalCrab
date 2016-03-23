abstract class BaseStatus extends BaseAttribute implements IStatus {
    
    public health : number;
    
    public constructor( controller : BaseController ){
        super(controller);
        // we recover the health of the character
        this.health = this.ctrl.health;
    }
    
    public damage( damage : number ){
        this.health -= damage;
    }
    
    public isDead() : boolean{
        return this.health <= 0;
    }
}
