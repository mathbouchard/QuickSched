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
            
            var defaults = {
                loff: 0,
                toff: 0
            };
             
            var options = $.extend(defaults, opts);
            
            return this.each(function() {
                
                $(this).empty();
                var obj = $(this);
                var bbar = $("<div id=\"workerbar\"></div>").appendTo($(this));
                bbar.css('width',$(window).width()-options.loff-20);
                
                $("<span id=\"workerradioassign\"></span>").html(
                    "<input type=\"radio\" id=\"workerradioedit\" checked=\"checked\" name=\"workerradioassign\"/><label for=\"workerradioedit\">Edit</label>"+
                    "<input type=\"radio\" id=\"workerradiotag\" name=\"workerradioassign\"/><label for=\"workerradiotag\">Tags</label>"+
                    "<input type=\"radio\" id=\"workerradiotask\" name=\"workerradioassign\"/><label for=\"workerradiotask\">Tasks</label>"+
                    "<input type=\"radio\" id=\"workerradioshift\" name=\"workerradioassign\"/><label for=\"workerradioshift\">Shifts</label>"+
                    "<input type=\"radio\" id=\"workerradioresource\" name=\"workerradioassign\"/><label for=\"workerradioresource\">Resources</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                
                $( "#workerradioedit" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currworkerlist" ).show();
                });
                
                $( "#workerradiotag" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currworkerlist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 3,
                        pos: 1,
                        loff: options.loff,
                        toff: options.toff+67,
                        upname: function(val) {return val.firstname+' '+val.lastname;},
                        updesc: function(val) {return val.code;},
                        upimg: true,
                        upobj: $.qsglobal.workers,
                        upblockclass: 'wblock',
                        uptextclass: 'wblocktext',
                        downobj: $.qsglobal.tags,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                $( "#workerradiotask" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currworkerlist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 0,
                        pos: 1,
                        loff: options.loff,
                        toff: options.toff+67,
                        upname: function(val) {return val.firstname+' '+val.lastname;},
                        updesc: function(val) {return val.code;},
                        upimg: true,
                        upobj: $.qsglobal.workers,
                        upblockclass: 'wblock',
                        uptextclass: 'wblocktext',
                        downobj: $.qsglobal.tasks,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                $( "#workerradioshift" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currworkerlist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 1,
                        pos: 1,
                        loff: options.loff,
                        toff: options.toff+67,
                        upname: function(val) {return val.firstname+' '+val.lastname;},
                        updesc: function(val) {return val.code;},
                        upimg: true,
                        upobj: $.qsglobal.workers,
                        upblockclass: 'wblock',
                        uptextclass: 'wblocktext',
                        downobj: $.qsglobal.shifts,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                $( "#workerradioresource" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currworkerlist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 2,
                        pos: 1,
                        loff: options.loff,
                        toff: options.toff+67,
                        upname: function(val) {return val.firstname+' '+val.lastname;},
                        updesc: function(val) {return val.code;},
                        upimg: true,
                        upobj: $.qsglobal.workers,
                        upblockclass: 'wblock',
                        uptextclass: 'wblocktext',
                        downdesc: function(val) {return val.description+' ('+val.capacity+')';},
                        downobj: $.qsglobal.resources,
                        downblockclass: 'rblock',
                        downtextclass: 'rblocktext',
                    });
                });
                
                $( "<span><button id=\"workerfullscreen\"></button></span>").css('float','right').appendTo(bbar).css('height', '32').css('background', '#95a0ff')
                    .button({text: false, icons: {primary: "ui-icon-arrowthick-2-ne-sw"}}).click(function() {
                        if(!$.qsglobal.isfullscreen) {
                            $.qsglobal.isfullscreen = true;
                            $("#workers").empty();
                            $( "#appmain" ).hide();
                            $("#fullscreen").show();
                            $( "#fullscreen" ).width($(window).width());
                            $( "#fullscreen" ).height($(window).height());
                            $("#fullscreen").workersScreen({loff: 0, toff: 0});
                            
                        } else {
                            $.qsglobal.isfullscreen = false;
                            $("#fullscreen").empty();
                            $("#fullscreen").hide();
                            $( "#appmain" ).show();
                            $("#workers").workersScreen({loff: 83, toff: 101});
                        }
                    });
                $( "<span><button id=\"workertrash\"></button></span>").css('float','right').appendTo(bbar).css('height', '32')
                    .css('background', '#95a0ff').button({text: false, icons: {primary: "ui-icon-trash"}});
                
                var ulist = $('<ul class="workerlist" id="currworkerlist"></ul>').appendTo( $( this ) );
         
                if($.qsglobal.workers != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="wblocktext">Add a new worker</div>').addClass("wblock").addClass("waddblock").attr("workerid", -1);
                    ulist.append(temp);
                    $.each($.qsglobal.workers, function(key,val) {
                        var imglink = "/img/someone.png";
                        if(val.picturelink != null) {
                            imglink = val.picturelink;  
                        } 
                        temp = $( "<li></li>" ).html('<div class="tcolorblock" style="background:'+val.color+'"><img src="'+imglink+'"></img></div><div class="wblocktext"><h3>'+val.firstname+" "+val.lastname+'</h3>'+val.code+'</div>').addClass("wblock").attr("workerid", val.id);
                        ulist.append(temp);
                    });
                }
                
                ulist.selectable({ filter: "li", cancel: ".ui-selected, .waddblock" });
            });
        }
    });
})(jQuery);

function getworkersdata(done) {
    $.qsglobal.workers = null;
    var workerinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getworkers', workerinfo, function(data) {
        if(data != null)
            $.qsglobal.workers = data.slice();
    }, true, done);
}