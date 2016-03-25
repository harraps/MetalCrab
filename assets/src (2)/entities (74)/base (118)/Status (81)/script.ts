abstract class BaseStatus implements IAttribute, IStatus {
    
    public ctrl : BaseController;
    
    public health : number;
    
    public init( controller : BaseController ){
        this.ctrl = controller;
        // we recover the health of the character
        this.health = this.ctrl.health;
    }
    
    public update(){}
    
    public damage( damage : number ){
        this.health -= damage;
    }
    
    public isDead() : boolean{
        return this.health <= 0;
    }
}
