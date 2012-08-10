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
        tasksScreen: function(opts) {          
            return this.each(function() { 
                var obj = $(this);
                obj.empty();
                
                var odata = {};
                var i = 0;
                
                $.each($.qsglobal.tasks, function(key,val) {
                    odata[i] = {name: '', starttimel:'0:00', startimeu:'0:00',durationl:'0:00',durationu:'0:00', color:'#00f'};
                    odata[i].starttimel = odata[i].starttimeu = val.starttime;
                    odata[i].durationl = odata[i].durationu = val.duration;
                    odata[i].name = val.name;
                    odata[i].color = val.color;
                    i++;
                });
                obj.ganttScreen(
                {
                    data: odata,
                    mult: 1.0,
                    itemname: 'task',
                    currw: $(document).width()-93,
                    hoff: 111,
                    onclick: function() {
                        if(!$.qsglobal.isfullscreen) {
                            $("#fullscreen").show();
                            $("#fullscreen").tasksScreen();
                            $( "#fullscreen" ).width($(window).width());
                            $( "#fullscreen" ).height($(window).height());
                            $.qsglobal.isfullscreen = true;
                        } else {
                            $("#fullscreen").hide();
                            $.qsglobal.isfullscreen = false;
                        }
                    }
                });
            });
        }
    });
})(jQuery);

function gettasksdata(done) {
    $.qsglobal.tasks = null;
    var taskinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'gettasks', taskinfo, function(data) {
        if(data != null)
            $.qsglobal.tasks = data.slice();
    }, true, done);
}