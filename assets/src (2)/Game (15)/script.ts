// http://stackoverflow.com/questions/18880715/texture-splatting-with-three-js
// http://algoholic.eu/unity3d-indie-free-portal-effect-project-sources/

declare let window;

// we add a scripts from outside sources
(function (){
    let scripts : string[] = [
        "http://connect.soundcloud.com/sdk.js" // We add the soundcloud SDK
    ];
    for( let script of scripts ){
        let script_div = window.document.createElement('script');
        script_div.type = "text/javascript";
        script_div.src = script;
        window.document.body.appendChild(script_div);
    }
})();

abstract class GAME {
    public static world    : CANNON.World;                  // the cannon physic world
    public static material : CANNON.Material;               // the base material for the game
    public static grounds  : CharacterGround[];             // the list of the ground modules we have to update
    public static player   : PlayerController;              // the controller of the player of the game
    public static enemies  : {[key:number]:EnemyController};// the list of controllers of the enemies of the game
    public static status   : {[key:number]:IStatus};        // the list of the status of object we have to take care of
    
    public static run(){
        // init world
        GAME.world = Sup.Cannon.getWorld();
        GAME.world.gravity.set( 0, -6000/Sup.Game.getFPS(), 0 );
        GAME.world.defaultContactMaterial.friction = 0.1;
        
        // init base material
        GAME.material = new CANNON.Material("base");
        GAME.world.addContactMaterial(new CANNON.ContactMaterial(GAME.material, GAME.world.defaultMaterial, {
            friction: 0,
            restitution: 0,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        }));
        
        // we create a list of the PlayerGrounds we have to update (to support moving platforms)
        GAME.grounds = [];
        
        // we create a map to store our enemies controller (the key is the id of the cannonBody)
        GAME.enemies = {};
        // we create a map to store the elements that can be damaged (the key is the id of the cannonBody)
        GAME.status  = {};
    }
}
GAME.run();
// we extends the behavior of CANNON.world to update the PlayerGrounds before the velocites are applied
(function (){
    var oldPrototype = GAME.world.step.prototype;
    var oldStep = GAME.world.step;
    GAME.world.step = function(){
        // we update the PlayerGrounds
        for( let ground of GAME.grounds ){
            ground.updatePosition();
        }
        // we execute the default behavior of CANNON.world
        oldStep.apply(this,arguments);
    };
    GAME.world.step.prototype = oldPrototype;
})();