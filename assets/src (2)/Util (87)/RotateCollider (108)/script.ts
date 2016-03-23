class RotateCollider extends Sup.Behavior {
    
    start() {
        // we create a rotation to rotate the cylinder shape
        let quat = new Sup.Math.Quaternion();
        quat.setFromYawPitchRoll( 0, -Math.PI*0.5, 0 );
        (<any>this.actor.cannonBody.body).shapeOrientations[0] = Util.getCannonQuat(quat);
        // we don't need this behavior anymore
        //this.destroy();
    }
}
Sup.registerBehavior(RotateCollider);
