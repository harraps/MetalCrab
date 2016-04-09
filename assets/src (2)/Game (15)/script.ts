// http://stackoverflow.com/questions/18880715/texture-splatting-with-three-js
// http://algoholic.eu/unity3d-indie-free-portal-effect-project-sources/

declare let window;
declare let SupEngine;
//SupEngine.THREE;

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
    
    public static level : Level;        // the current level of the game
    public static input : InputManager; // manage the inputs of the player
    
    public static start(){
        
        // init input manager
        GAME.input = new InputManager("QWERTY");
    }
}
GAME.start();
GAME.level = new Level();
GAME.input.reset("AZERTY");

// run stuff in self executing function
/*(function (){
    
})();*/