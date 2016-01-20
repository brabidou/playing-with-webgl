/**
 * Scene Manager handles everything related to Scene, Camera, Rendering, Object Mesh's and Events
 *
 * @class SceneManager
 * @param {boolean} debug - true: will display the stats window in top right.
 * @param {boolean} debug - false: will hide stats window.
 * @return SceneManager Object not instanciated
 * @author Ben Rabidou
 * @date_created 1/20/2016
 */
var SceneManager = function( debug ) {
    this.init( debug );
};


/**
 * Wires up the defaults for the scene and wires up events to the DOM
 *
 * @constructor init
 * @param {boolean} debug
 * @return null
 */
SceneManager.prototype.init = function( debug ) {
    Logger.debug("Creating SceneManager");
    this._DEBUG             = debug;
    this._VIEW_ANGLE        = 45.0;
    this._NEAR              = 0.1;
    this._FAR               = 10000.0;

    this._scene             = null;
    this._camera            = null;
    this._renderer          = null;
    this._controls          = null;
    this._stats             = null;
    this._projector         = null;
    this._mouseVector       = null;
    this._raycaster         = null;
    this._renderCallbacks   = [];

    this._clickableObjects  = [];
    this._intersectsObjects = null;
    this._start_click       = null;

    jQuery( window ).on( "resize", jQuery.proxy(this.onWindowResize, this) );
    jQuery( window ).on( "mousedown", jQuery.proxy(this.onMouseDown, this) );
    jQuery( window ).on( "mouseup", jQuery.proxy(this.onMouseUp, this) );
};




////////////////////////
///CLASS MAIN METHODS///
////////////////////////


/**
 * This spins up a new scene and all associated Cameras, Renderers, Controls
 * and starts the animation render loop.
 *
 * @function createLCA
 * @return Canvas DOM element to be added to the DOM
 */
SceneManager.prototype.createLCA = function( ) {

    //Create the Scene
    this._scene         = new THREE.Scene();
    this._projector     = new THREE.Projector();
    this._mouseVector   = new THREE.Vector3();
    this._raycaster     = new THREE.Raycaster();            


    if( this._DEBUG ) {
        this._stats = new Stats();
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.right = '0px';
        document.body.appendChild( this._stats.domElement );
    }        

    //Get screen width and hight.
    //Generate the aspectRatio;
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

    //Build the Camera
    this._camera = new THREE.PerspectiveCamera( this._VIEW_ANGLE, aspectRatio, this._NEAR, this._FAR);
    this._scene.add( this._camera );
    this._camera.position.set(130,70,800);
    this._camera.lookAt(this._scene.position);  

    if ( Detector.webgl )
        this._renderer = new THREE.WebGLRenderer( {antialias:true} );
    else
        this._renderer = new THREE.CanvasRenderer(); 

    this._renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

    ////////////////////////
    // ORBITAL CONTROLLER //
    ////////////////////////
    this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );

    //This Kicks off the animation Loop of doom
    this._animate();

    return this._renderer.domElement;
};


/**
 * Animation loop runs as fast as the browser will allow.
 * It also looks to see if any RenderCallbacks have been set
 * and calls them if it can
 *
 * @function _animate
 * @access private
 * @return null
 */
SceneManager.prototype._animate = function() {
    requestAnimationFrame( $.proxy(this._animate, this) );
    this._renderer.render( this._scene, this._camera );

    if( this._stats ) {
        this._stats.update();
    }

    for(var i in this._renderCallbacks) {
        this._renderCallbacks[i]();
    }

    this._controls.update();
};




///////////////////////////////////////////
///CLASS GETTERS/SETTERS/ADDERS/REMOVERS///
///////////////////////////////////////////


/**
 * Adds a Mesh ojbect to the scene
 *
 * @function add
 * @param {mesh} mesh This is a mesh object to be added to the scene.
 * @return null
 */
SceneManager.prototype.add = function( mesh ) {
    if( this._scene && mesh ) {
        this._scene.add( mesh );
    }
};


/**
 * Removes a Mesh ojbect to the scene
 *
 * @function remove
 * @param {mesh} mesh This is a mesh object to be removed from the scene.
 * @return null
 * @TODO remove any events assocaited with object
 */
SceneManager.prototype.remove = function( mesh ) {
    if( this._scene && mesh ) {
        this._scene.remove( mesh );
    }
};


/**
 * We need to look add clickable objects the scene manager will not assume that 
 * all objects are clickable.
 *
 * @function addClickableObjects
 * @param {mesh} mesh
 * @return null
 */
SceneManager.prototype.addClickableObjects = function( mesh ) {
    this._clickableObjects.push(mesh);
};


/**
 * Adds a callback to the renderer callbacks. We will call the function
 * each time the _animation loop runs
 *
 * @function addRenderCallback
 * @callback {function} callback This is a mesh object to be added to the scene.
 * @return null
 */
SceneManager.prototype.addRenderCallback = function(callback) {
    if(typeof(callback) === "function") {
        this._renderCallbacks.push(callback);
    }
};


/**
 * Gets the scene
 *
 * @function getScene
 * @return {scene} Scene Object
 */
SceneManager.prototype.getScene = function() {
    return this._scene;
};


/**
 * Gets the camera
 *
 * @function getCamera
 * @return {camera} Camera Object
 */
SceneManager.prototype.getCamera = function() {
    return this._camera;
};

/**
 * Gets the renderer
 *
 * @function getRenderer
 * @return {renderer} Renderer Object
 */
SceneManager.prototype.getRenderer = function() {
    return this._renderer;
};

/**
 * Gets the controls
 *
 * @function getControls
 * @return {controls} Controls Object
 */
SceneManager.prototype.getControls = function() {
    return this._controls;
};




//////////////////
///CLASS EVENTS///
//////////////////


/**
 * Window resize gets called by jquery.
 * Any time the window is resized to reset the camera and renderer.
 *
 * @function onWindowResize
 * @param {event} e
 * @return null
 */
SceneManager.prototype.onWindowResize = function( e ) {
    //Make sure everything is setup before kicking off this update
    if(this._camera && this._renderer) {
        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
        var aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

        this._camera.aspect = aspectRatio;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    }
};


/**
 * Window mousedown gets called by jquery.
 * Called on mouse down to find all objects that the mouse was over at that moment.
 * There is a timer set (this._start_click) to determine if the scene was moved while the 
 * click down event was inprogress. This will be used in the onMouseUp fucntion.
 *
 * We save all the objects found that were clicked on. Note this get all the objects clicked
 * on even the ones behind the front most object. MouseUp can chose to ignore that.
 * _intersectsObjects Array at 0 will be the first most and the end of the array will 
 * be the furthest away object
 *
 * @function onMouseDown
 * @param {event} e
 * @return null
 */
SceneManager.prototype.onMouseDown = function( e ) {
    Logger.debug("mousedown");
    this._start_click = new Date();
    this._intersectsObjects = null;

    if( this._mouseVector && this._camera && this._raycaster && this._clickableObjects ) {
        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
        this._mouseVector.x = 2 * (e.clientX / SCREEN_WIDTH) - 1;
        this._mouseVector.y = 1 - 2 * ( e.clientY / SCREEN_HEIGHT );
        this._mouseVector.unproject( this._camera );
        this._raycaster.set( this._camera.position, this._mouseVector.sub( this._camera.position ).normalize() );
        this._intersectsObjects = this._raycaster.intersectObjects( this._clickableObjects );
    }
};


/**
 * Window mouseup gets called by jquery.
 * Called on mouse up, checks to see if the time differential between the mouse down and
 * mouse up is lessthan or equal to 150 milliseconds. If true we look thru the objects
 * and call subobjects to see if anyone has a clicked funcion if so call it.
 *
 * We break out of the loop becuase we only want the top most object.
 *
 * @function onMouseUp
 * @param {event} e
 * @return null
 */
SceneManager.prototype.onMouseUp = function( e ) {
    Logger.debug("mouseup");
    if( this._intersectsObjects && this._start_click && (new Date())-this._start_click <= 150 ) {
         for( var i = 0; i < this._intersectsObjects.length ; i++ ) {
            var intersectionObject = this._intersectsObjects [ i ],
                obj = intersectionObject.object;

            if(typeof obj.userData.clicked === "function") 
                obj.userData.clicked( obj );

            break;
        }
    }
    this._intersectsObjects = null;
    this._start_click = null;
};
