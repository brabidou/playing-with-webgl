/**
 * Game Manager handles everything related to the game itsself. Creating the box,
 * Colors, click event callbacks.
 *
 * @class GameManager
 * @return GameManager Object not instanciated
 * @author Ben Rabidou
 * @date_created 1/20/2016
 */
var GameManager = function(  ) {
    this.init(  );
};


/**
 * Wires up the defaults
 *
 * @constructor init
 * @return null
 * @TODO we should pull out the colors from this class
 */
GameManager.prototype.init = function(){
    this._sphere_material_white   = null;
    this._sphere_material_red     = null;
    this._sphere_material_blue    = null;
};




////////////////////////
///CLASS MAIN METHODS///
////////////////////////


/**
 * Creates the main game box and basic layout based on the given board.
 *
 * @function createBox
 * @param {object} board The board layout and matrix
 * @param {object} player_one The first player object
 * @param {object} player_two The second player object
 * @return {group} A Grouping of objects that can be added to the scene or other group 
 */
GameManager.prototype.createBox = function( board, player_one, player_two ) {
    var box = ObjectsFactory.GenerateGroup();
    box.name = "box_main";

    //Sphere material to change the color of the balls
    //TODO: pull out these colors
    this._sphere_material_white   = ObjectsFactory.GenerateSphereMaterial( 0xdddddd );
    this._sphere_material_red     = ObjectsFactory.GenerateSphereMaterial( 0xEE115F );
    this._sphere_material_blue    = ObjectsFactory.GenerateSphereMaterial( 0x1166EE );

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
                    _temp_material = this._sphere_material_red;
                } else if( server_sphere.owner === player_two.player_id ) {
                    _temp_material = this._sphere_material_blue;

                } else {
                    _temp_material = this._sphere_material_white;
                }

                var sphere = ObjectsFactory.GenerateTextSphere( server_sphere.value.toString(), _temp_material );
                sphere.userData.sphere_id = "";

                var outerSphere = _.find(sphere.children, function(s){ return s.userData.type === "SPHERE_OBJECT" });
                outerSphere.userData.clicked = $.proxy(this.onSphereClicked, this);

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




//////////////////
///CLASS EVENTS///
//////////////////


/**
 * Called anytime an sphere obhect has been clicked 
 *
 * @function onSphereClicked
 * @param {sphere} obj This is ther sphere object
 * @return null
 */
GameManager.prototype.onSphereClicked = function( obj ) {
    if(obj.userData.selected === true) { 
        obj.material = this._sphere_material_white;
        obj.userData.selected = false;
    } else {
        obj.material = this._sphere_material_blue;
        obj.userData.selected = true;
    }
};