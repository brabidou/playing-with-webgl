var ObjectsFactory = new function() {
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

    //////////////
    //GENERATORS//
    //////////////
    this.GenerateTextSphere = function( text, sphere_material ) {
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

    this.GenerateSphere = function( geometry, material ) {
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

    this.GenerateSphereGeometry = function( size ) {
        if( !size ) 
            size = this._DEFAULT_SPHERE_SIZE ;

        var geometry = new THREE.SphereGeometry( 
            size, 
            this._DEFAULT_FACES_COUNT, 
            this._DEFAULT_FACES_COUNT 
        ); 
        return geometry
    };

    this.GenerateSphereMaterial = function( color ) {
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

    this.GenerateText = function( text, geometry, material ) {
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


    this.GenerateAmbientLight = function( color ) {
        Logger.debug("Creating Ambient Light Object");
        if( !color ) {
            color = this._DEFAULT_AMBIENT_LIGHT; // soft white light
        }

        var amlight = new THREE.AmbientLight( color );
        return amlight;
    };

    this.GenerateFloor = function(  ) {
        Logger.debug("Creating Floor Object");
        var floorTexture = new THREE.ImageUtils.loadTexture( 'img/checkerboard.jpg' );
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
        floorTexture.repeat.set( 10, 10 );
        var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = Math.PI / 2;
        return floor;
    };

    this.GenerateGroup = function() {
        return new THREE.Group();
    }


};