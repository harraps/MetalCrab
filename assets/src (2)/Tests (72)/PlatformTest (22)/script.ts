class PlatformTestBehavior extends Sup.Behavior {
    
    private body : CANNON.Body;
    private angle : number;    

    awake() {
        this.body = this.actor.cannonBody.body;
        this.angle = 0;
        //this.body.material = playerMaterial;
        this.body.type = CANNON.Body.KINEMATIC;
    }

    update() {
        let vel = this.body.velocity;
        if( Sup.Input.isKeyDown("NUMPAD8") ){
            this.body.position.z++;
            //vel.z += 20;
        }else if( Sup.Input.isKeyDown("NUMPAD2") ){
            this.body.position.z--;
            //vel.z -= 20;
        }
        
        if( Sup.Input.isKeyDown("NUMPAD5") ){
            //vel.x = 0;
            //vel.z = 0;
        }
        
        this.body.velocity = vel;
        if( Sup.Input.isKeyDown("NUMPAD7") ){
            this.angle -= 0.01;
        }else if( Sup.Input.isKeyDown("NUMPAD9") ){
            this.angle += 0.02;
        }
        this.body.quaternion.setFromEuler(0,this.angle,0);
        let vect = this.body.position.clone();
        vect.y += 20;
        
        //let iray = Util.createIRay( this.body.position, vect );
        let ray = new CANNON.Ray(vect,this.body.position);
        if( ray.intersectBodies([ this.body ]) ){
            Sup.log("touched something !");
        }
    }
}
Sup.registerBehavior(PlatformTestBehavior);
