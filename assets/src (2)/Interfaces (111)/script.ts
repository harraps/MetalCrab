
// allow to define objects that can be damaged
interface IStatus {
    health : number;
    damage( damage : number );
    isDead() : boolean;
}

// specified the interaction possible with a weapon
interface IArm {
    fire   : boolean; // trigger is down
    pulse  : boolean; // trigger   was just pressed
    reload : boolean; // reloading was just pressed
}