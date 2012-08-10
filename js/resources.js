/*
 * QuickSchedule Resources jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        resourcesScreen: function(opts) {          
            return this.each(function() {
                var obj = $(this);
                obj.empty();
                   
                var ulist = $('<ul></ul>').appendTo( $( this ) );
    
            
                if($.qsglobal.resources != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="rblocktext">Add a new tag</div>').addClass("rblock").addClass("raddblock").attr("resourceid", -1);
                    ulist.append(temp);
                    $.each($.qsglobal.resources, function(key,val) {
                        
                        temp = $( "<li></li>" ).html('<div class="rcolorblock" style="background:'+val.color+'"></div><div class="rblocktext"><h3>'+val.name+'</h3>'
                                    +val.description+' ('+val.capacity+')</div>').addClass("rblock").attr("resource", val.id);
                        ulist.append(temp);
                    });
                }
                
                ulist.sortable({
                    items: "li:not(.raddblock)",
                    sort: function() {
                        $( this ).removeClass( "ui-state-default" );
                    }
                });
            });
        }
    });
})(jQuery);

function getresourcesdata(done) {
    $.qsglobal.resources = null;
    var taginfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getresources', taginfo, function(data) {
        if(data != null)
            $.qsglobal.resources = data.slice();
    }, true, done);
}