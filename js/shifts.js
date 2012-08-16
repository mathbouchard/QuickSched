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
            
            var defaults = {
                loff: 0,
                toff: 0
            };
             
            var options = $.extend(defaults, opts);
            
            return this.each(function() { 
                $(this).empty();
                
                var bbar = $("<div id=\"shiftbar\"></div>").appendTo($(this));
                bbar.css('width',$(window).width()-options.loff-20);
                
                $("<span id=\"shiftradioassign\"></span>").html(
                    "<input type=\"radio\" id=\"shiftradioedit\" checked=\"checked\" name=\"shiftradioassign\"/><label for=\"shiftradioedit\">Edit</label>"+
                    "<input type=\"radio\" id=\"shiftradiotag\" name=\"shiftradioassign\"/><label for=\"shiftradiotag\">Tags</label>"+
                    "<input type=\"radio\" id=\"shiftradioworker\" name=\"shiftradioassign\"/><label for=\"shiftradioworker\">Workers</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                    
                $("<label for=\"shiftslider\">Zoom:</label>").css('margin-left',20).css('margin-top',8).css('float','left').appendTo(bbar);
                $("<div id=\"shiftslider\"></div>").css('margin-left',10).css('margin-top',10).css('width',100).css('float','left').slider({
                    min: 0.2,
		    max: 3.0,
                    step: .025,
                    value: 1.6,
                    slide: function( event, ui ) {
                        $("#shiftgantt").ganttScreen({
                            data: $.qsglobal.shifts,
                            mult: 3.2-ui.value,
                            itemname: 'shift',
                            currw: $(window).width()-options.loff,
                            hoff: options.toff,
                            moff: 0,
                        });
		    }
                }).appendTo(bbar);
                
                $( "<span><button id=\"shiftfullscreen\">Hey</button></span>").css('float','right').appendTo(bbar).css('height', '32').css('background', '#95a0ff')
                    .button({text: false, icons: {primary: "ui-icon-arrowthick-2-ne-sw"}}).click(function() {
                        if(!$.qsglobal.isfullscreen) {
                            $.qsglobal.isfullscreen = true;
                            $("#shifts").empty();
                            $( "#appmain" ).hide();
                            $("#fullscreen").show();
                            $( "#fullscreen" ).width($(window).width());
                            $( "#fullscreen" ).height($(window).height());
                            $("#fullscreen").shiftsScreen({loff: 0, toff: 0});
                            
                        } else {
                            $.qsglobal.isfullscreen = false;
                            $("#fullscreen").empty();
                            $("#fullscreen").hide();
                            $( "#appmain" ).show();
                            $("#shifts").shiftsScreen({loff: 83, toff: 101});
                        }
                    });
                
                $( "<span><button id=\"shifttrash\"></button></span>").css('float','right').appendTo(bbar).css('height', '32')
                    .css('background', '#95a0ff').button({text: false, icons: {primary: "ui-icon-trash"}});
                var obj = $("<div id=\"shiftgantt\"></div>").appendTo($(this));
                obj.addClass("ganttcontainer").css('width', $(window).width()-options.loff).css('height', $(window).height()-options.toff-1-65);
                obj.css('overflow', 'scroll');
                
                obj.ganttScreen(
                {
                    data: $.qsglobal.shifts,
                    mult: 1.6,
                    itemname: 'shift',
                    currw: $(window).width()-options.loff,
                    hoff: options.toff,
                    moff: 0,
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