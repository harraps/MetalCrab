class PlayerInventory implements IAttribute {
    
    public ctrl : PlayerController; 
    
    protected ammo : number[];
    
    // tells if the weapon has been unlocked or not
    protected unlocked : boolean[]; 
    // each weapon that has been given to the player
    protected inventoryL : IInventory;
    protected inventoryR : IInventory;
    
    // we can only have a maximum of 10 weapons slot (matching the 10 numeric keys)
    protected static maxArms : number = 10;
    protected current : number;
    
    // return the weapon held by the player
    public get LeftWeapon() : AbstractWeapon{
        return this.inventoryL.current;
    }
    public get RightWeapon() : AbstractWeapon{
        return this.inventoryR.current;
    }
    
    // return this name of the weapon held by the player
    public get LeftName() : string{
        return this.inventoryL.equiped[this.current];
    }
    public get RightName() : string{
        return this.inventoryR.equiped[this.current];
    }
    
    public init( controller : PlayerController ){
        this.ctrl = controller;
        
        this.initAmmo();
        this.initInventory();
        
        // we reserve 10 slots for the weapons for each arm
        this.inventoryL.equiped[PlayerInventory.maxArms-1] = null;
        this.inventoryR.equiped[PlayerInventory.maxArms-1] = null;
    }
    
    private initAmmo(){
        // we initialize the ammo array
        this.ammo = [];
        for( let name of WeaponManager.ammos ){
            this.ammo[name] = 0;
        }
    }
    private initInventory(){
        // we init the list that manage the weapon that are stored in the inventory
        this.unlocked   = [];
        this.inventoryL = {
            weapons : [],
            equiped : [],
            current : null
        };
        this.inventoryR = {
            weapons : [],
            equiped : [],
            current : null
        };
        // we init the weapons unlock
        for( let name of WeaponManager.humanWeapons ){
            this.unlocked[name] = false;
        }
        this.initInventorySide(true );
        this.initInventorySide(false);
        
    }
    private initInventorySide( left : boolean ){
        let array = left ? this.inventoryL.weapons : this.inventoryR.weapons;
        array["hook"        ] = null;
        array["knife"       ] = null;
        array["rifle"       ] = null;
        array["shotgun"     ] = null;
        array["sniper"      ] = null;
        array["machinegun"  ] = null;
        array["grenader"    ] = null;
        array["cannon"      ] = null;
        array["freezer"     ] = null;
        array["flamethrower"] = null;
        array["teslagun"    ] = null;
        array["pulsar"      ] = null;
        array["blazar"      ] = null;
    }
    
    public update() {
        
    }
    
    
    
    // set the current weapons by there id in the list
    public setCurrentWeapons ( id : number ){
        // if one of the weapon is not set to null
        if( this.differentThanNull(id) ){
            this.setHoldedWeapons(id);
        }
    }
    // go to the next weapons
    public scrollWeapons ( direction : boolean ){
        // we recover the id of current weapon
        let id = this.current;
        // we select the right direction
        let dir = direction ? 1 : -1;
        do{
            // we increment the id
            id += dir;
            // if we overflow the maximum of weapons held by the player
            if( id >= PlayerInventory.maxArms ) id = 0;
            else if( id < 0 ) id = PlayerInventory.maxArms-1;
            // if we make a complete loop and go back to our starting point
            if( id == this.current ) return; // we stop
        }while( this.differentThanNull(id) );
        // we found the next weapon we wanted
        this.setHoldedWeapons(id);
    }
    private differentThanNull ( id : number ){
        return
            this.inventoryL.equiped[id] != null &&
            this.inventoryR.equiped[id] != null;
    }
    
    // we set the holded weapons of the player
    protected setHoldedWeapons( id : number ){
        // we replace the holded weapons by the new ones
        this.inventoryL.current = this.inventoryL.weapons[this.inventoryL.equiped[id]];
        this.inventoryR.current = this.inventoryR.weapons[this.inventoryR.equiped[id]];
        // we set the new holded weapons id
        this.current = id;
    }
    
    // unlock weapons
    public isWeaponUnlocked( name : string ){
        return this.unlocked[name];
    }
    public unlockWeapon( name : string ){
        this.unlocked[name] = true;
    }
    
    // manage weapons in the inventory
    public setWeapon( name : string, id : number, left : boolean ){
        // if the weapon has been unlocked
        if( this.unlocked[name] ){
            // if we are changing a weapon on the specified side
            let inventory = left ? this.inventoryL : this.inventoryR;
            inventory.equiped[id] = inventory.weapons[name];
        }
    }
}

interface IInventory{
    weapons : AbstractWeapon[];
    equiped : string[];
    current : AbstractWeapon;
}
