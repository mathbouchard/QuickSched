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
            
            var defaults = {
                loff: 0,
                toff: 0
            };
             
            var options = $.extend(defaults, opts);
            
            return this.each(function() { 
                $(this).empty();
                
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
                var bbar = $("<div id=\"taskbar\"></div>").appendTo($(this));
                bbar.css('width',$(window).width()-options.loff-20);
                $("<span id=\"taskradioshow\"></span>").html(
                    "<input type=\"radio\" id=\"taskradiotask\" checked=\"checked\" name=\"taskradioshow\"/><label for=\"taskradiotask\">Tasks</label>"+
                    "<input type=\"radio\" id=\"taskradiodemand\" name=\"taskradioshow\"/><label for=\"taskradiodemand\">Demands</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                
                $("<span id=\"taskradioassign\"></span>").html(
                    "<input type=\"radio\" id=\"taskradioedit\" checked=\"checked\" name=\"taskradioassign\"/><label for=\"taskradioedit\">Edit</label>"+
                    "<input type=\"radio\" id=\"taskradiotag\" name=\"taskradioassign\"/><label for=\"taskradiotag\">Tags</label>"+
                    "<input type=\"radio\" id=\"taskradioworker\" name=\"taskradioassign\"/><label for=\"taskradioworker\">Workers</label>"+
                    "<input type=\"radio\" id=\"taskradioresource\" name=\"taskradioassign\"/><label for=\"taskradioresource\">Resources</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                    
                $("<label for=\"taskslider\">Zoom:</label>").css('margin-left',20).css('margin-top',8).css('float','left').appendTo(bbar);
                $("<div id=\"taskslider\"></div>").css('margin-left',10).css('margin-top',10).css('width',100).css('float','left').slider({
                    min: 0.2,
		    max: 3.0,
                    step: .025,
                    value: 1.6,
                    slide: function( event, ui ) {
                        $("#taskgantt").ganttScreen({
                            data: odata,
                            mult: 3.2-ui.value,
                            itemname: 'task',
                            currw: $(window).width()-options.loff,
                            hoff: options.toff,
                            moff: 0,
                        });
		    }
                }).appendTo(bbar);
                
                
                $( "<span><button id=\"taskfullscreen\"></button></span>").css('float','right').appendTo(bbar).css('height', '32').css('background', '#95a0ff')
                    .button({text: false, icons: {primary: "ui-icon-arrowthick-2-ne-sw"}}).click(function() {
                        if(!$.qsglobal.isfullscreen) {
                            $.qsglobal.isfullscreen = true;
                            $("#tasks").empty();
                            $( "#appmain" ).hide();
                            $("#fullscreen").show();
                            $( "#fullscreen" ).width($(window).width());
                            $( "#fullscreen" ).height($(window).height());
                            $("#fullscreen").tasksScreen({loff: 0, toff: 0});
                            
                        } else {
                            $.qsglobal.isfullscreen = false;
                            $("#fullscreen").empty();
                            $("#fullscreen").hide();
                            $( "#appmain" ).show();
                            $("#tasks").tasksScreen({loff: 83, toff: 101});
                        }
                    });
                $( "<span><button id=\"tasktrash\"></button></span>").css('float','right').appendTo(bbar).css('height', '32')
                    .css('background', '#95a0ff').button({text: false, icons: {primary: "ui-icon-trash"}});
                var obj = $("<div id=\"taskgantt\"></div>").appendTo($(this));
                obj.addClass("ganttcontainer").css('width', $(window).width()-options.loff).css('height', $(window).height()-options.toff-1-65);
                obj.css('overflow', 'scroll');
                
                obj.ganttScreen(
                {
                    data: odata,
                    mult: 1.6,
                    itemname: 'task',
                    currw: $(window).width()-options.loff,
                    hoff: options.toff,
                    moff: 0,
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