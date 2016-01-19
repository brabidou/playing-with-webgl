var ApplicationMain = function() {
    Logger.debug("Creating ApplicationMain");

    var sceneManager = new SceneManager( true );
    document.body.appendChild( sceneManager.createLCA() );
    sceneManager.add( ObjectsFactory.GenerateAmbientLight() );
    sceneManager.add( ObjectsFactory.GenerateFloor() );

    var gridSizeMax = 5;
    var distance = 180;
    var offset = (distance * (gridSizeMax - 1)) / 2.0;

    //Big performance improvmenst for reusing the same Geometry over and over;
    var _defaultGeometry = ObjectsFactory.GenerateSphereGeometry();
    var box = ObjectsFactory.GenerateGroup();
    box.name = "box1";

    for(var gridPosX=0; gridPosX < gridSizeMax; gridPosX++) {
        for(var gridPosY=0; gridPosY < gridSizeMax; gridPosY++) {
            for(var gridPosZ=0; gridPosZ < gridSizeMax; gridPosZ++) {


                var sphere = ObjectsFactory.GenerateTextSphere( Math.round(Math.random() * 10).toString() );
                sphere.position.set(
                    (gridPosX * distance) -offset, 
                    (gridPosY * distance) -offset, 
                    (gridPosZ * distance) -offset
                );
                box.add( sphere );
            }
        }
    }
    sceneManager.add(box);


    sceneManager.addRenderCallback($.proxy(function() {
        box.rotateX(.005);
        box.rotateY(.006);
        box.rotateZ(.008);

        /*
        var camera = sceneManager.getCamera();
        camera.rotateX(.01);
        camera.rotateY(.01);
        camera.rotateZ(.01);
        */
    }, this));

};