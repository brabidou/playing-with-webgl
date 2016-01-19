var ApplicationMain = function() {
    Logger.debug("Creating ApplicationMain");

    var sceneManager = new SceneManager( true );
    var gameService = new GameService();
    document.body.appendChild( sceneManager.createLCA() );
    sceneManager.add( ObjectsFactory.GenerateAmbientLight() );
    //sceneManager.add( ObjectsFactory.GenerateFloor() );

    var gridSizeMax = 5;
    var distance = 180;
    var offset = (distance * (gridSizeMax - 1)) / 2.0;

    //Big performance improvmenst for reusing the same Geometry over and over;
    var _defaultGeometry = ObjectsFactory.GenerateSphereGeometry();
    /*
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
    sceneManager.add(box);*/
    this._box = ObjectsFactory.GenerateGroup();
    this._box.name = "box";

    var game_id = getParameterByName("game_id");
    var player_id = getParameterByName("game_id");

    //gameService.GetGameForUser( "f04bbf30d9624c89b187b6020cbbe1a5", "f04bbf30d9624c89b187b6020cbbe1a5")
    gameService.GetGameForUser( game_id, player_id )
        .done($.proxy(function(data) {

            var sphere_material_white = ObjectsFactory.GenerateSphereMaterial( 0xdddddd );
            var sphere_material_red = ObjectsFactory.GenerateSphereMaterial( 0xEE115F );
            var sphere_material_blue = ObjectsFactory.GenerateSphereMaterial( 0x1166EE );

            var gridX = data.board.matrix;
            var gridSizeMaxX = gridX.length;
            for(var gridPosX=0; gridPosX < gridSizeMaxX; gridPosX++) {
                var gridY = gridX[gridPosX];
                var gridSizeMaxY = gridY.length;

                for(var gridPosY=0; gridPosY < gridSizeMaxY; gridPosY++) {
                    var gridZ = gridY[gridPosY];
                    var gridSizeMaxZ = gridZ.length;

                    for(var gridPosZ=0; gridPosZ < gridSizeMaxZ; gridPosZ++) {
                        var server_sphere = gridZ[gridPosZ];
                        var _temp_material;
                        if( server_sphere.owner === data.player_one.player_id ) {
                            _temp_material = sphere_material_red;
                        } else if( server_sphere.owner === data.player_two.player_id ) {
                            _temp_material = sphere_material_blue;

                        } else {
                            _temp_material = sphere_material_white;
                        }

                        var sphere = ObjectsFactory.GenerateTextSphere( server_sphere.value.toString(), _temp_material );
                        sphere.position.set(
                            (gridPosX * distance) -offset, 
                            (gridPosY * distance) -offset, 
                            (gridPosZ * distance) -offset
                        );
                        this._box.add( sphere );
                    }
                }
            }
            sceneManager.add( this._box );

        }, this));


    sceneManager.addRenderCallback($.proxy(function() {
        //box.rotateX(.005);
        //box.rotateY(.006);
        //box.rotateZ(.008);

        /*
        var camera = sceneManager.getCamera();
        camera.rotateX(.01);
        camera.rotateY(.01);
        camera.rotateZ(.01);
        */
    }, this)); 

};


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
} 