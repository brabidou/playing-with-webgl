var SceneManager = function( debug ) {
    Logger.debug("Creating SceneManager");
    this._DEBUG = debug;
    this._VIEW_ANGLE = 45.0;
    this._NEAR = 0.1;
    this._FAR = 10000.0;

    this._scene = null;
    this._camera = null;
    this._renderer = null;
    this._controls = null;
    this._stats = null;


    //Returns the dom object ready for injection
    //This will setup the Lights, Camera, and Scene
    this.createLCA = function( ) {

        //Create the Scene
        this._scene = new THREE.Scene();


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


    this._animate = function() {
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


    this.add = function( mesh ) {
        if( this.getScene() ) {
            this.getScene().add( mesh );
        }
    };

    this.remove = function( mesh ) {
        if( this.getScene() ) {
            this.getScene().remove( mesh );
        }
    };

    this.getScene = function() {
        return this._scene;
    };

    this.getCamera = function() {
        return this._camera;
    };

    this.getRenderer = function() {
        return this._renderer;
    };

    this.getControls = function() {
        return this._controls;
    };

    this._renderCallbacks = [];
    this.addRenderCallback = function(callback) {
        if(typeof(callback) === "function") {
            this._renderCallbacks.push(callback);
        }
    }

}