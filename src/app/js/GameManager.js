//var GameManager = function(sceneManager, gameService) {
var GameManager = function(  ) {    
    /*if( !sceneManager ) throw "No Scene Manager Created";
    if( !gameService ) throw "No Game Service Created";
    this.sceneManager = sceneManager;*/


    this.createBox = function( board, player_one, player_two ) {
        var box = ObjectsFactory.GenerateGroup();
        box.name = "box_main";

        //Sphere material to change the color of the balls
        //TODO: pull out these colors
        var sphere_material_white   = ObjectsFactory.GenerateSphereMaterial( 0xdddddd );
        var sphere_material_red     = ObjectsFactory.GenerateSphereMaterial( 0xEE115F );
        var sphere_material_blue    = ObjectsFactory.GenerateSphereMaterial( 0x1166EE );

        //Grid stuff
        //We just use the first x axis to determine the size of the grid. Just used for centering the box
        var distance                = 180;
        var offset                  = (distance * (board.matrix.length - 1)) / 2.0;

        //Let the magic begin and build the box.
        //gridX will be the first dimention of the array.
        var gridX = board.matrix;
        for(var gridPosX=0; gridPosX < gridX.length; gridPosX++) {

            //gridY will be the second dimention of the array.
            var gridY = gridX[gridPosX];

            for(var gridPosY=0; gridPosY < gridY.length; gridPosY++) {

                //gridZ will be the third dimention of the array.
                var gridZ = gridY[gridPosY];

                for(var gridPosZ=0; gridPosZ < gridZ.length; gridPosZ++) {
                    var server_sphere = gridZ[gridPosZ];
                    var _temp_material;
                    if( server_sphere.owner === player_one.player_id ) {
                        _temp_material = sphere_material_red;
                    } else if( server_sphere.owner === player_two.player_id ) {
                        _temp_material = sphere_material_blue;

                    } else {
                        _temp_material = sphere_material_white;
                    }

                    var sphere = ObjectsFactory.GenerateTextSphere( server_sphere.value.toString(), _temp_material );
                    sphere.userData.sphere_id = "";
                    var outerSphere = _.find(sphere.children, function(s){ return s.userData.type === "SPHERE_OBJECT" });
                    outerSphere.userData.clicked = $.proxy(function( obj ) {
                        if(obj.userData.selected === true) { 
                            obj.material = sphere_material_white;
                            obj.userData.selected = false;
                        } else {
                            obj.material = sphere_material_blue;
                            obj.userData.selected = true;
                        }
                    }, this);

                    sphere.position.set(
                        (gridPosX * distance) -offset, 
                        (gridPosY * distance) -offset, 
                        (gridPosZ * distance) -offset
                    );
                    box.add( sphere );
                }
            }
        }
        return box;
    };

};