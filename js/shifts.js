/*
 * QuickSchedule Tasks jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        shiftsScreen: function(opts) {          
            return this.each(function() { 
                var obj = $(this);
                obj.empty();
                
                var odata = {};
                var i = 0;
                
                obj.ganttScreen(
                {
                    data: $.qsglobal.shifts,
                    mult: 1.6,
                    itemname: 'shift',
                    currw: $(document).width()-93,
                    hoff: 111,
                    onclick: function() { alert('overidden'); }
                });
            });
        }
    });
})(jQuery);

function getshiftsdata(done) {
    $.qsglobal.shifts = null;
    var taskinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getshifts', taskinfo, function(data) {
        if(data != null)
            $.qsglobal.shifts = data.slice();
    }, true, done);
}