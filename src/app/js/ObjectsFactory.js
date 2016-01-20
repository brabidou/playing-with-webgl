/**
 * Scene Objects Factory
 *
 * @class ObjectsFactory
 * @return GameService Singleton Object
 * @author Ben Rabidou
 * @date_created 1/20/2016
 */
var _objectsFactory = function() {
    this.init();
};


/**
 * Wires up the defaults for the objects factory
 *
 * @constructor init
 * @return null
 */
_objectsFactory.prototype.init = function( ) { 
    ////////////////////
    //DEFAULTS SECTION//
    ////////////////////

    //GLOBAL DEFAULTS
    this._DEFAULT_FACES_COUNT = 32;             //THIS DETERMINES THE NUMBER OF SIDEDS AN OBJECT HAS. MORE IS HIGHER QUALITY

    //SPHERE
    this._DEFAULT_SPHERE_SIZE = 40.0;
    this._DEFAULT_SPHERE_COLOR = 0xffffff;
    this._DEFAULT_SPHERE_TRASPARENT = true;
    this._DEFAULT_SPHERE_OPACITY = 0.50;

    //LIGHTING
    this._DEFAULT_AMBIENT_LIGHT = 0xdddddd;
};





////////////////////////
///CLASS MAIN METHODS///
////////////////////////

/**
 * Genereats a Text Sphere Object which is a group of a text inside a sphere
 *
 * @function GenerateTextSphere
 * @param {string} [text] Calls GenerateText with the given text to live inside the sphere
 * @param {object} [text=Calls GenerateText]
 * @param {object} [sphere_material= calls GenerateSphereMateral to get default] The material to use on the sphere
 * @return {object} A Three Group object with a sphere and text inside of it
 */
_objectsFactory.prototype.GenerateTextSphere = function( text, sphere_material ) {
    if( !sphere_material ) {
        sphere_material = this.GenerateSphereMaterial();
    }
    var SphereGeometry  = this.GenerateSphereGeometry();
    var sphere = this.GenerateSphere(SphereGeometry, sphere_material);
    

    if ( !text ) {
        text = this.GenerateText();
    } else if( typeof(text) === "string") {
        text = this.GenerateText( text );
    } 

    var group = this.GenerateGroup();
    group.add( sphere );
    group.add( text );
    return group;
}


/**
 * Genereats a Sphere Object
 *
 * @function GenerateSphere
 * @param {object} geometry The Three geometry to use on the sphere 
 * @param {object} material The Three material to use on the sphere
 * @return {object} A Three Sphere Object
 */
_objectsFactory.prototype.GenerateSphere = function( geometry, material ) {
    Logger.debug("Creating Sphere Object");
    if( !geometry ) {
        geometry = this.GenerateSphereGeometry();
    }

    if( !material ) {
        material = this.GenerateSphereMaterial();
    }

    var sphere = new THREE.Mesh(geometry, material);
    sphere.userData.type = "SPHERE_OBJECT";
    return sphere;
};


/**
 * Genereats a Sphere Geometry
 *
 * @function GenerateSphereGeometry
 * @param {int} [size=DEFAULT_SPHERE_SIZE] the size of the sphere geomatry to generate
 * @return {object} A Three Sphere Geometry Object
 */
_objectsFactory.prototype.GenerateSphereGeometry = function( size ) {
    if( !size ) 
        size = this._DEFAULT_SPHERE_SIZE ;

    var geometry = new THREE.SphereGeometry( 
        size, 
        this._DEFAULT_FACES_COUNT, 
        this._DEFAULT_FACES_COUNT 
    ); 
    return geometry
};


/**
 * Genereats a Sphere Material
 *
 * @function GenerateSphereMaterial
 * @param {float} [color=DEFAULT_SPHERE_COLOR] The color of the materal
 * @return {object} A Three Sphere Material Object
 */
_objectsFactory.prototype.GenerateSphereMaterial = function( color ) {
    if( !color ) {
        //color = Math.random() * 0xffffff;
        color = this._DEFAULT_SPHERE_COLOR;
    }
    var material = new THREE.MeshLambertMaterial({
        color : color,
        transparent: this._DEFAULT_SPHERE_TRASPARENT, 
        opacity: this._DEFAULT_SPHERE_OPACITY
    }); 
    return material;
};


/**
 * Generates Text
 *
 * @function GenerateText
 * @param {string} [text="Hello World"] Text to use
 * @param {object} [geometry=Default Text Teometry] The Geometry to use on the text
 * @param {object} [material=Default Text Material] The Material to use on the text
 * @return {object} A Three Text Object
 */
_objectsFactory.prototype.GenerateText = function( text, geometry, material ) {
    if( !text ) {
        text  = "Hello World";
    }

    if( !geometry ) {
        var geometry = new THREE.TextGeometry( text, {
            size: 25,
            height: 5,
            curveSegments: 2,
            font: "helvetiker"
        });
        geometry.computeBoundingBox();
    }

    if( !material ) {
        material = new THREE.MeshFaceMaterial( [
            new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } ),
            new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
        ]);
    }

    var text = new THREE.Mesh( geometry, material );
    return text;
};


/**
 * Generates Ambient Light Object
 *
 * @function GenerateAmbientLight
 * @param {float} color Color of the light
 * @return {object} A Three Ambient Light Object
 */
_objectsFactory.prototype.GenerateAmbientLight = function( color ) {
    Logger.debug("Creating Ambient Light Object");
    if( !color ) {
        color = this._DEFAULT_AMBIENT_LIGHT; // soft white light
    }

    var amlight = new THREE.AmbientLight( color );
    return amlight;
};


/**
 * Generates Floor Object
 *
 * @function GenerateFloor
 * @param {string} image URL to image object
 * @return {object} A Three Floor Object
 */
_objectsFactory.prototype.GenerateFloor = function( image ) {
    Logger.debug("Creating Floor Object");
    if( !image ) {
        image = 'img/checkerboard.jpg';
    }

    var floorTexture = new THREE.ImageUtils.loadTexture( image );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 10, 10 );
    var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    return floor;
};


/**
 * Generates Group Object
 *
 * @function GenerateGroup
 * @return {object} A Three Group Object
 */
_objectsFactory.prototype.GenerateGroup = function(  ) {
    return new THREE.Group();
}


/**
 * New up the ObjectsFactory singleton object
 * 
 * @global ObjectsFactory
 */
var ObjectsFactory = new _objectsFactory();