// allow to define objects that can be damaged
interface IStatus {
    health : number;
    damage( damage : number );
    isDead() : boolean;
}

abstract class BaseStatus implements IAttribute, IStatus {
    
    public ctrl : BaseController;
    
    public health : number;
    
    public init( controller : BaseController ){
        this.ctrl = controller;
        // we recover the health of the character
        this.health = this.ctrl.health;
        
        // we add the status to the list of status
        GAME.level.addStatus(this.ctrl.body.id, this);
    }
    
    public update(){}
    
    public damage( damage : number ){
        this.health -= damage;
    }
    
    public isDead() : boolean{
        return this.health <= 0;
    }
}
