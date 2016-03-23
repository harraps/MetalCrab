// allow to define objects that can be damaged
interface IStatus {
    health : number;
    damage( damage : number );
    isDead() : boolean;
}
