var GameService = function() {
    this.base_url = "http://guarded-lowlands-1412.herokuapp.com";
    this.ajax_settings = {
        dataType : "json",
        method: "GET"
    };

    this.GetGameForUser = function( game_id, user_id ) {
        var ajax_call = {
            url : this.base_url + "/games/" + game_id + "/user/" + user_id
        };
        jQuery.extend(ajax_call, this.ajax_settings);
        return ajaxCall( ajax_call );
    };  

    this.GetGameForUserTemp = function( game_id, user_id ) {
        var ajax_call = {
            url : "json/test.json"
        };
        jQuery.extend(ajax_call, this.ajax_settings);

        return jQuery.ajax(ajax_call);
    };  

    function ajaxCall( ajaxParams ) {
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

};