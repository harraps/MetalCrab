// http://stackoverflow.com/questions/18880715/texture-splatting-with-three-js
// http://algoholic.eu/unity3d-indie-free-portal-effect-project-sources/

let WORLD = Sup.Cannon.getWorld();
WORLD.gravity.set( 0, -6000/Sup.Game.getFPS(), 0 );
WORLD.defaultContactMaterial.friction = 0.1;

let PLAYERMATERIAL = new CANNON.Material("playerMaterial");
WORLD.addContactMaterial(new CANNON.ContactMaterial(PLAYERMATERIAL, WORLD.defaultMaterial, {
    friction: 0,
    restitution: 0,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
}));

// we create a list of the PlayerGrounds we have to update (to support moving platforms)
let PLAYERGROUNDS : PlayerGround[] = [];
// we extends the behavior of CANNON.world to update the PlayerGrounds before the velocites are applied
(function (){
    var oldPrototype = WORLD.step.prototype;
    var oldStep = WORLD.step;
    WORLD.step = function(){
        // we update the PlayerGrounds
        for( let ground of PLAYERGROUNDS ){
            ground.updatePosition();
        }
        // we execute the default behavior of CANNON.world
        oldStep.apply(this,arguments);
    };
    WORLD.step.prototype = oldPrototype;
})();