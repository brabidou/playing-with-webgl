/**
 * Game Service allows for communcation with the service and handles network errors
 *
 * @class GameService
 * @return GameService Object not instanciated
 * @author Ben Rabidou
 * @date_created 1/20/2016
 */
var GameService = function() {
    this.init(  );
};

/**
 * Wires up the defaults for the service
 *
 * @constructor init
 * @return null
 */
GameService.prototype.init = function(  ) {
    this.base_url = "http://guarded-lowlands-1412.herokuapp.com";
    this.ajax_settings = {
        dataType : "json",
        method: "GET"
    };
};



////////////////////////
///CLASS MAIN METHODS///
////////////////////////

/**
 * Calls the service to the get main game data
 *
 * @function GetGameForUser
 * @param {string} game_id The Game ID
 * @param {string} user_id The users ID
 * @return {promise} A promise with the data if success
 */
GameService.prototype.GetGameForUser = function( game_id, user_id ) {
    var ajax_call = {
        url : this.base_url + "/games/" + game_id + "/player/" + user_id
    };
    jQuery.extend(ajax_call, this.ajax_settings);
    return this._ajaxCall( ajax_call );
};  


/**
 * Generic ajax call so we can handle errors in one place
 *
 * @function _ajaxCall
 * @param {object} ajaxParams
 * @return {promise} A promise with the data if success
 */
GameService.prototype._ajaxCall = function( ajaxParams ) {
    var dfd = jQuery.Deferred();
    jQuery.ajax( ajaxParams )
        .done(function( data ) {
            if(data) {
                dfd.resolve( data );
            } else {
                dfd.reject("Data from server was nulllllllll");
            }
        })
        .fail(function(data) {
            dfd.reject( "Call Failed" );
        })
    ;

    return dfd.promise();
};
