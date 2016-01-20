var SceneManager = function( debug ) {
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

    //Returns the dom object ready for injection
    //This will setup the Lights, Camera, and Scene
    this.createLCA = function( ) {

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

    this.addClickableObjects = function( mesh ) {
        this._clickableObjects.push(mesh);
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

    this.addRenderCallback = function(callback) {
        if(typeof(callback) === "function") {
            this._renderCallbacks.push(callback);
        }
    }

    ////////////
    ///EVENTS///
    ////////////
    this.onWindowResize = function( e ) {
        //Make sure everything is setup before kicking off this update
        if(this._camera && this._renderer) {
            var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
            var aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

            this._camera.aspect = aspectRatio;
            this._camera.updateProjectionMatrix();

            this._renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        }
    };


    this.onMouseDown = function( e ) {
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

    this.onMouseUp = function( e ) {
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
    }

    jQuery( window ).on( "resize", jQuery.proxy(this.onWindowResize, this) );
    jQuery( window ).on( "mousedown", jQuery.proxy(this.onMouseDown, this) );
    jQuery( window ).on( "mouseup", jQuery.proxy(this.onMouseUp, this) );

}