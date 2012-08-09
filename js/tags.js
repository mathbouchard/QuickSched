/*
 * QuickSchedule Tags jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        tagsScreen: function(opts) {          
            $( this ).empty(); 
            
            return this.each(function() {
                var obj = $(this);
                   
                var ulist = $('<ul></ul>').appendTo( $( this ) );
    
            
                if($.qsglobal.tags != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="tblocktext">Add a new tag</div>').addClass("tblock").addClass("taddblock").attr("tagid", -1);
                    ulist.append(temp);
                    $.each($.qsglobal.tags, function(key,val) {
                        
                        temp = $( "<li></li>" ).html('<div class="tcolorblock" style="background:'+val.color+'"></div><div class="tblocktext"><h3>'+val.name+'</h3>'
                                    +val.description+'</div>').addClass("tblock").attr("tagid", val.id);
                        ulist.append(temp);
                    });
                }
                
                ulist.sortable({
                    items: "li:not(.taddblock)",
                    sort: function() {
                        $( this ).removeClass( "ui-state-default" );
                    }
                });
            });
        }
    });
})(jQuery);

function gettagsdata() {
    $.qsglobal.tags = null;
    var taginfo = {token:$.qsglobal.session_token};
    postjson('https://localhost:8443/RestSchedWS/qsdata/gettags', taginfo, function(data) {
        if(data != null)
            $.qsglobal.tags = data.slice();
    });
}