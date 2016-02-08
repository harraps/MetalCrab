class GenerateMap extends Sup.Behavior {
    
    public reservedLayers: number = 1;
    
    private boxes : ITrileBox[];

    private tilemap : Sup.TileMap;
    private tileset : Sup.TileSet;
    
    private trileSize : Sup.Math.XYZ;
    
    awake() {
        // we add a cannonBody to the map
        new Sup.Cannon.Body(this.actor, null);
        let body : CANNON.Body = this.actor.cannonBody.body;
        body.mass = 0;
        body.type = CANNON.Body.STATIC;
        
        // we move the cannonBody to the right location
        body.position = Util.getCannonVec( this.actor.getPosition() );
        
        // send collisions to every one
        body.collisionFilterGroup = -1;
        body.collisionFilterMask = -1;
        
        body.fixedRotation = true;
        body.material = WORLD.defaultMaterial;
        
        // we create an array of bounding boxes, this will allow us to check if triles are already part of a shape
        this.boxes = [];
        
        this.tilemap = this.actor.tileMapRenderer.getTileMap();
        this.tileset = this.actor.tileMapRenderer.getTileSet();
        
        this.trileSize = {
            x: this.tileset.getGridSize().width,
            y: 10,//tilemap.getLayersDepthOffset(),
            z: this.tileset.getGridSize().height
        };
        
        // the last layer should be used for pathfinding
        for( let y=0; y<this.tilemap.getLayerCount()-this.reservedLayers; ++y ){
            // we cycle trough each tile of the map
            for( let x=0; x<this.tilemap.getWidth(); ++x ){
                for( let z=0; z<this.tilemap.getHeight(); ++z ){
                    // we recover the tile at the position
                    let tile = this.tilemap.getTileAt( y, x, z );
                    
                    let properties = this.tileset.getTileProperties( tile );
                    
                    // we declare our actor here, in case we need to give it its own CannonBody
                    let trile : Sup.Actor;
                    
                    // if our tile has both a type and trile property
                    if( "type" in properties && "trile" in properties ){
                        // we create a new actor
                        trile = new Sup.Actor("trile");
                        // we set the model renderer with the right model ( trile... of type... )
                        new Sup.ModelRenderer( trile, "res/triles/"+properties["type"]+"/"+properties["trile"] );
                        
                        // we define the position of the trile, based on the position of the tile
                        let pos = new Sup.Math.Vector3( x*this.trileSize.x, y*this.trileSize.y, -z*this.trileSize.z );
                        // the position of the trile is relative to the position of the tilemap
                        pos.add(this.actor.getPosition());
                        // we center the trile to the tile
                        pos.add( 0.5*this.trileSize.x, -0.5*this.trileSize.y, -0.5*this.trileSize.z );
                        
                        // we move the trile to the right position
                        trile.setPosition( pos );
                        
                        // if our tile has also a orientation property
                        if( "orientation" in properties ){
                            trile.setEulerY( parseFloat(properties["orientation"])*Math.PI/180 );
                        }
                    }
                    
                    // if the tile has a physic property
                    if( "physic" in properties ){
                        let pos = {x:x, y:y, z:z};
                        // if it hasn't a physic box already
                        if( !this.alreadyCheckedPhysic( pos ) ){
                            
                            if( properties["physic"] === "box" ){ // if the physic property is of type box
                                let box = this.createLargestBox( pos );
                                this.boxes[this.boxes.length] = box; // we add the box to the list
                                
                                // now that we know the size of the collider, we can create it
                                let halfSize = new CANNON.Vec3(
                                    ( 1 + box.point2.x - box.point1.x )*this.trileSize.x*0.5,
                                    ( 1 + box.point2.y - box.point1.y )*this.trileSize.y*0.5,
                                    ( 1 + box.point2.z - box.point1.z )*this.trileSize.z*0.5
                                );
                                let offset = new CANNON.Vec3(
                                     box.point1.x*this.trileSize.x + halfSize.x,
                                     box.point1.y*this.trileSize.y - halfSize.y,
                                    -box.point1.z*this.trileSize.z - halfSize.z
                                );
                                body.addShape( new CANNON.Box( halfSize ), offset );
                                
                            }else if( properties["physic"] === "slope" ){ // if it's of type slope
                                // we recover the orientation property (a second time for an other purpose)
                                let orientation = "orientation" in properties ? parseFloat(properties["orientation"]) : 0;
                                let slope = this.createLargestSlope( pos, orientation );
                                this.boxes[this.boxes.length] = slope; // we add the slope to the list
                                
                                // we recover the length of the slope
                                let length = orientation==0 || orientation==180 ? (1+slope.point2.x-slope.point1.x)*this.trileSize.x : (1+slope.point2.z-slope.point1.z)*this.trileSize.z;
                                let halfSize : Sup.Math.XYZ = { x: length*0.5, y: this.trileSize.y*0.5, z: this.trileSize.z*0.5 };
                                
                                // now that we know the size of the collider, we can create it
                                let vertices = [
                                    // first side
                                    new CANNON.Vec3( -halfSize.x, -halfSize.y, -halfSize.z ),
                                    new CANNON.Vec3( -halfSize.x, -halfSize.y,  halfSize.z ),
                                    new CANNON.Vec3( -halfSize.x,  halfSize.y,  halfSize.z ),
                                    // second side
                                    new CANNON.Vec3(  halfSize.x, -halfSize.y, -halfSize.z ),
                                    new CANNON.Vec3(  halfSize.x, -halfSize.y,  halfSize.z ),
                                    new CANNON.Vec3(  halfSize.x,  halfSize.y,  halfSize.z )
                                ];
                                // /!\ we have to be cautionous of the order of the vertices /!\
                                let faces : any = [
                                    [0,1,2], // first side
                                    [5,4,3], // second side
                                    [0,3,4,1],
                                    [1,4,5,2],
                                    [0,2,5,3]
                                ];
                                let offset = new CANNON.Vec3(
                                    ( slope.point1.x + (1+slope.point2.x-slope.point1.x)*0.5)*this.trileSize.x,
                                    ( slope.point1.y - (1+slope.point2.y-slope.point1.y)*0.5)*this.trileSize.y,
                                    (-slope.point1.z - (1+slope.point2.z-slope.point1.z)*0.5)*this.trileSize.z
                                );
                                let polyhedron = new CANNON.ConvexPolyhedron( vertices, faces);
                                let convexBody = new CANNON.Body();
                                WORLD.addBody( convexBody );
                                convexBody.mass = 0;
                                convexBody.type = CANNON.Body.STATIC;
                                // we move the cannonBody to the right location
                                convexBody.position = offset.vadd( Util.getCannonVec(this.actor.getPosition()) );
                                convexBody.quaternion.setFromEuler( 0, (orientation+180)*Math.PI/180, 0);
                                // send collisions to every one
                                convexBody.collisionFilterGroup = -1;
                                convexBody.collisionFilterMask = -1;
                                convexBody.fixedRotation = true;
                                convexBody.material = WORLD.defaultMaterial;
                                convexBody.addShape( polyhedron );
                            }
                        }
                    }
                }
            }
        }
        
        // we're done making the map, we can remove the tilemap renderer
        this.actor.tileMapRenderer.destroy();
    }
    
    private createLargestBox( pos: Sup.Math.XYZ ){
        // we create a new triles box
        let box: ITrileBox = {
            point1: pos, // this value shouldn't change
            point2: {
                x: this.tilemap.getWidth()-1,
                y: this.tilemap.getLayerCount()-(this.reservedLayers+1), // last layer is reserved
                z: this.tilemap.getHeight()-1
            },
        };
        // from the given position, ( we already know the first tile is of type box)
        // we check along the x-axis,
        for( let x=pos.x+1; x<=box.point2.x; ++x ){
            // if the pointed tile is not of type box
            if( !this.checkPhysicBox( { x: x, y: pos.y, z: pos.z} ) ){
                // we adapt the zone we want to check
                box.point2.x = x-1;
                break;
            }
        }
        //  then the z-axis, ( we already know the first row is of type box )
        for( let z=pos.z+1; z<=box.point2.z; ++z ){
            for( let x=pos.x; x<=box.point2.x; ++x ){
                // if one tile of the row is not of type box
                if( !this.checkPhysicBox( { x: x, y: pos.y, z: z } ) ){
                    // we adapt the zone we want to check
                    box.point2.z = z-1;
                    break;
                }
            }
        }
        // and finally the y-axis, ( we already know the first layer is of type box )
        for( let y=pos.y+1; y<=box.point2.y; ++y ){
            for( let z=pos.z; z<=box.point2.z; ++z ){
                for( let x=pos.x; x<=box.point2.x; ++x ){
                    // if one tile of the layer is not of type box
                    if( !this.checkPhysicBox( { x: x, y: y, z: z } ) ){
                        // we adapt the collider zone
                        box.point2.y = y-1;
                        return box; // we can directly return the box
                    }
                }
            } 
        }
        return box;
    }
    
    private createLargestSlope( pos: Sup.Math.XYZ, orientation: number ){
        // based on the given orientation, we can know if we have to check for next tiles on the x-axis or the y-axis
        let Xaxis = false;
        if( orientation === 0 || orientation === 180 ) Xaxis = true;
        // we create the new triles box
        let box: ITrileBox = {
            point1: pos,
            point2: {
                x: Xaxis ? this.tilemap.getWidth()-1 : pos.x,
                y: pos.y,
                z: !Xaxis ? this.tilemap.getHeight()-1 : pos.z
            }
        };
        if( Xaxis ){
            for( let x=pos.x; x<=box.point2.x; ++x ){
                // if we reach a tile that is not of type slope or is not oriented the same way
                if( !this.checkPhysicSlope( { x: x, y: pos.y, z: pos.z }, orientation ) ){
                    // we have found the size of the shape we wanted
                    box.point2.x = x-1;
                    break;
                }
            }
        }else{
            for( let z=pos.z; z<=box.point2.z; ++z ){
                // if we reach a tile that is not of type slope or is not oriented the same way
                if( !this.checkPhysicSlope( { x: pos.x, y: pos.y, z: z }, orientation ) ){
                    // we have found the size of the shape we wanted
                    box.point2.z = z-1;
                    break;
                }
            }
        }
        return box;
    }
    
    private checkPhysicBox( pos : Sup.Math.XYZ ) : boolean{
        // if it's not already part of an other collider
        if( !this.alreadyCheckedPhysic(pos) ){
            // we recover the tile at the position
            let tile = this.tilemap.getTileAt( pos.y, pos.x, pos.z );
            // we recover its properties
            let properties = this.tileset.getTileProperties(tile);
            // if the tile has a physic property attached to it
            if( "physic" in properties ){
                // if it's set to box
                if( properties["physic"] === "box" ){
                    return true;
                }
            }
        }
        return false;
    }

    private checkPhysicSlope( pos: Sup.Math.XYZ, orientation: number ): boolean{
        // if it's not already part of an other collider
        if( !this.alreadyCheckedPhysic(pos) ){
            // we recover the tile at the position
            let tile = this.tilemap.getTileAt( pos.y, pos.x, pos.z );
            // we recover its properties
            let properties = this.tileset.getTileProperties(tile);
            // if the tile has a physic property attached to it
            if( "physic" in properties ){
                // we recover the orientation of the other tile
                let otherOrien = "orientation" in properties ? properties["orientation"] : 0;
                // if it's set to slope and both tile have the same orientation
                if( properties["physic"] === "slope" && orientation == otherOrien){ // otherOrien can be a string
                    return true;
                }
            }
        }
        return false;
    }

    // return true if the trile is already part of a collider
    private alreadyCheckedPhysic ( pos : Sup.Math.XYZ ): boolean{
        // for each collider shape we defined for our map
        for( let box of this.boxes ){
            // if our trile happend to be in one of them
            if( GenerateMap.trileInBox( pos, box ) ){
                // then said trile already has physic
                return true;
            }
        }
        // otherwise no
        return false;
    }
    
    private static trileInBox ( pos : Sup.Math.XYZ, box : ITrileBox ) : boolean{
        return (
            box.point1.x <= pos.x && pos.x <= box.point2.x &&
            box.point1.y <= pos.y && pos.y <= box.point2.y &&
            box.point1.z <= pos.z && pos.z <= box.point2.z
        );
    }
}
Sup.registerBehavior(GenerateMap);

// define an inclusive block that contains all of the tiles represented by a collider shape
interface ITrileBox {
    point1: Sup.Math.XYZ;
    point2: Sup.Math.XYZ;
}
