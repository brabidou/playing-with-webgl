/**
 * Logger object, new it up at the bottom to the Logger global
 *
 * @class Logger
 * @return GameService Singleton Object
 * @author Ben Rabidou
 * @access private
 * @date_created 1/20/2016
 */
var _logger = function() {

};




////////////////////////
///CLASS MAIN METHODS///
////////////////////////

/**
 * Logger.debug
 *
 * @function debug
 * @param {string} str Message to log
 * @return null
 */
_logger.prototype.debug = function(str) {
    console.debug(str);
}


/**
 * Logger.log
 *
 * @function log
 * @param {string} str Message to log
 * @return null
 */
_logger.prototype.log = function(str) {
    console.log(str);
}

/**
 * New up the logger singleton object 
 * 
 * @global Logger
 */
var Logger = new _logger();