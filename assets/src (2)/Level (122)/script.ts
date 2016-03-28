class Level {
    
    protected world  : CANNON.World;    // the cannon physic world
    protected defMat : CANNON.Material; // the base material for the game
    
    // the list of the ground modules we have to update
    protected grounds : CharacterGround[];
    
    // the controller of the player of the game
    protected player : PlayerController;
    // the list of controllers of the enemies of the game
    protected enemies : {[key:number]:EnemyController};
    
    // the list of the status of object we have to take care of
    protected status : {[key:number]:IStatus};
    
    // once we loaded a new level, we must call this constructor
    public constructor(){
        // we recover the cannon world object
        this.world = Sup.Cannon.getWorld();
        this.world.gravity.set( 0, -6000/Sup.Game.getFPS(), 0 );
        this.world.defaultContactMaterial.friction = 0.1;
        
        // init base material
        this.defMat = new CANNON.Material("base");
        this.world.addContactMaterial(new CANNON.ContactMaterial(this.defMat, this.world.defaultMaterial, {
            friction: 0,
            restitution: 0,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        }));
        
        // we create a list of the PlayerGrounds we have to update (to support moving platforms)
        this.grounds = [];
        
        // we create a map to store our enemies controller (the key is the id of the cannonBody)
        this.enemies = {};
        // we create a map to store the elements that can be damaged (the key is the id of the cannonBody)
        this.status  = {};
        
        this.updateStepFunction();
    }
    
    // GETTER
    public get World() : CANNON.World{
        return this.world;
    }
    public get DefaultMaterial() : CANNON.Material{
        return this.defMat;
    }
    public get Player() : PlayerController{
        return this.player;
    }
    public get Enemies() : {[key:number]:EnemyController}{
        return this.enemies;
    }
    public getEnemy( id : number ) : EnemyController{
        return this.enemies[id];
    }
    public getStatus( id : number ) : IStatus{
        return this.status[id];
    }
    // SETTER
    public set Player( player : PlayerController ){
        this.player = player;
    }
    // ADD
    public addEnemy( id : number, enemy : EnemyController ){
        this.enemies[id] = enemy;
    }
    public addStatus( id : number, status : IStatus ){
        this.status[id] = status;
    }
    public addGroundModule( ground : CharacterGround ){
        this.grounds[this.grounds.length] = ground;
    }
    // REMOVE
    public remove( id : number ){
        delete this.enemies[id];
        delete this.status [id];
    }
    public removeGroundModule( ground : CharacterGround ){
        for( let i=0; i<this.grounds.length; ++i ){
            if( ground == this.grounds[i] ){
                (<any>this.grounds).remove(i);
                break;
            }
        }
    }
    
    // we extends the behavior of CANNON.world to update the PlayerGrounds before the velocites are applied
    private updateStepFunction(){
        // we recover the prototype and the old step function
        var oldPrototype = this.world.step.prototype;
        var oldStep = this.world.step;
        // we change the step function
        var Level = this;
        this.world.step = function(){
            // we update the PlayerGrounds
            for( let ground of Level.grounds ){
                ground.updatePosition();
            }
            // we execute the default behavior of CANNON.world
            oldStep.apply(this,arguments);
        };
        // we reapply the prototype
        this.world.step.prototype = oldPrototype;
    }
}
