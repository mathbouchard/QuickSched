/*
 * QuickSchedule Workers jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        workersScreen: function(opts) {          
            $( this ).empty(); 
            
            return this.each(function() {
                var obj = $(this);
                   
                var ulist = $('<ul></ul>').appendTo( $( this ) );
    
            
                if($.qsglobal.workers != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="wblocktext">Add a new worker</div>').addClass("wblock").addClass("waddblock").attr("workerid", -1);
                    ulist.append(temp);
                    $.each($.qsglobal.workers, function(key,val) {
                        var imglink = "/img/someone_wb.png";
                        if(val.picturelink != null) {
                            imglink = val.picturelink;
                        }
                        temp = $( "<li></li>" ).html('<img src="'+imglink+'"></img><div class="wblocktext"><h3>'+val.firstname+" "+val.lastname+'</h3>'+val.code+'</div>').addClass("wblock").attr("workerid", val.id);
                        ulist.append(temp);
                    });
                }
                
                ulist.sortable({
                    items: "li:not(.waddblock)",
                    sort: function() {
                        $( this ).removeClass( "ui-state-default" );
                    }
                });
            });
        }
    });
})(jQuery);

function getworkersdata() {
    $.qsglobal.workers = null;
    var workerinfo = {token:$.qsglobal.session_token};
    postjson('https://localhost:8443/RestSchedWS/qsdata/getworkers', workerinfo, function(data) {
        if(data != null)
            $.qsglobal.workers = data.slice();
    });
}