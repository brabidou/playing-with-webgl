var ApplicationMain = function() {
    Logger.debug("Creating ApplicationMain");

    var sceneManager = new SceneManager( true );
    var gameService = new GameService();
    //var gameManager = new GameManager(sceneManager, gameService);
    var gameManager = new GameManager();

    document.body.appendChild( sceneManager.createLCA() );
    sceneManager.add( ObjectsFactory.GenerateAmbientLight() );
    //sceneManager.add( ObjectsFactory.GenerateFloor() );

    var game_id = Utilities.getParameterByName("game_id");
    var player_id = Utilities.getParameterByName("game_id");


    var loading_screen = pleaseWait({
        logo: "img/synapse.png",
        backgroundColor: '#f46d3b',
        loadingHtml: "<div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
    });

    gameService.GetGameForUser( game_id, player_id )

        .done($.proxy(function( data ) {
            var box = gameManager.createBox(data.board, data.player_one, data.player_two);
            sceneManager.add(box);
        }, this))
        .fail($.proxy(function( data ){
            sweetAlert("Oops...", data, "error");
        }, this))
        .always(function() {
            loading_screen.finish();
        })
    ;


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