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

        return jQuery.ajax(ajax_call);
    };  

        this.GetGameForUserTemp = function( game_id, user_id ) {
        var ajax_call = {
            url : "json/test.json"
        };
        jQuery.extend(ajax_call, this.ajax_settings);

        return jQuery.ajax(ajax_call);
    };  

};