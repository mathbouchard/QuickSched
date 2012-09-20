/*
 * QuickSchedule Tasks jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://skdit.com
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
                mobj = $(this);
                
                var bbar = $("<div id=\"shiftbar\"></div>").appendTo($(this));
                bbar.css('width',$(window).width()-options.loff-20);
                
                $("<span id=\"shiftradioassign\"></span>").html(
                    "<input type=\"radio\" id=\"shiftradioedit\" checked=\"checked\" name=\"shiftradioassign\"/><label for=\"shiftradioedit\">"+tr("Edit")+"</label>"+
                    "<input type=\"radio\" id=\"shiftradiotag\" name=\"shiftradioassign\"/><label for=\"shiftradiotag\">"+tr("Tags")+"</label>"+
                    "<input type=\"radio\" id=\"shiftradioworker\" name=\"shiftradioassign\"/><label for=\"shiftradioworker\">"+tr("Workers")+"</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                
                $( "#shiftradioedit" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#shiftgantt" ).show();
                    $( "#shiftslider" ).show();
                    $( "#shifttrash" ).show();
                    $( "#shiftsliderlabel" ).show();
                });
                $( "#shiftradiotag" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#shiftgantt" ).hide();
                    $( "#shiftslider" ).hide();
                    $( "#shiftsliderlabel" ).hide();
                    $( "#shifttrash" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(mobj);
                    newwin.vMap({
                        type: 6,
                        pos: 1,
                        loff: options.loff,
                        toff: options.toff+67,
                        upobj: $.qsglobal.shifts,
                        upblockclass: 'tblock',
                        uptextclass: 'tblocktext',
                        downobj: $.qsglobal.tags,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                $( "#shiftradioworker" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#shiftgantt" ).hide();
                    $( "#shiftslider" ).hide();
                    $( "#shiftsliderlabel" ).hide();
                    $( "#shifttrash" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(mobj);
                    newwin.vMap({
                        type: 1,
                        pos: 2,
                        loff: options.loff,
                        toff: options.toff+67,
                        upobj: $.qsglobal.shifts,
                        upblockclass: 'tblock',
                        uptextclass: 'tblocktext',
                        downname: function(val) {return val.firstname+' '+val.lastname;},
                        downdesc: function(val) {return val.code;},
                        downobj: $.qsglobal.workers,
                        downimg: true,
                        downblockclass: 'wblock',
                        downtextclass: 'wblocktext',
                    });
                });    
                    
                $("<label id=\"shiftsliderlabel\" for=\"shiftslider\">"+tr("Zoom")+":</label>").css('margin-left',20).css('margin-top',8).css('float','left').appendTo(bbar);
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
                
                $( "<span><button id=\"shiftfullscreen\">Fullscreen</button></span>").css('float','right').appendTo(bbar).css('height', '32').css('background', '#a0b4d2')
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
                
                $( "<span id=\"shifttrash\"><button>Delete</button></span>").css('float','right').appendTo(bbar).css('height', '32')
                    .css('background', '#a0b4d2').button({text: false, icons: {primary: "ui-icon-trash"}}).click(function() {
                        rem=[];
                        $( ".ui-selected", ".shiftlist" ).each(function() {
                            var ind = $("#currshiftlist li").index(this)-1;                            
                            rem.push(ind);
                            var sub=0;
                            $.each(rem, function(key,val) {
                                if(val<ind) {
                                    sub++;
                                }
                            });
                            ind=ind-sub;
                            
                            var shiftinfo = {token:$.qsglobal.session_token, id:$( this ).attr( "shiftid" )};
                            postjson($.qsglobal.dbaddr+'delshifts', shiftinfo, function(data) {
                                if(data.success == "true") {
                                    $.qsglobal.shifts.splice(ind,1);
                                } else {
                                    alert(tr("Failed to delete"));
                                }
                            }, false, null);
			});
                        if(!$.qsglobal.isfullscreen) {
                            $("#normalscreen").shiftsScreen({loff: 83, toff: 101});
                        } else {
                            $("#fullscreen").shiftsScreen();
                        }
                    });
                var obj = $("<div id=\"shiftgantt\"></div>").appendTo($(this));
                obj.addClass("ganttcontainer").css('width', $(window).width()-options.loff).css('height', $(window).height()-options.toff-1-65);
                obj.css('overflow-x', 'auto');
                
                obj.ganttScreen(
                {
                    data: $.qsglobal.shifts,
                    mult: 1.6,
                    itemname: 'shift',
                    currw: $(window).width()-options.loff,
                    hoff: options.toff,
                    moff: 0,
                    onclick: function(name, ind) {
                        $( "#shift-form" ).shiftEditScreen({ind:ind, item:$.qsglobal.shifts[ind]}).dialog( "open" )
                            .dialog("option", "title", name).dialog("open");
                    }
                });
            });
        },
        shiftEditScreen: function(opts) {          
            $( this ).empty();
            
            //Settings list and the default values
            var defaults = {
                ind: -1,
                item: null
            };    
            var o = $.extend(defaults, opts);
            o.reload = function () { showshifts(); };
            o.idname = "shift-edit";
            o.prefix="sedit-";
            o.width = 30;
            o.savefunction = function(o) {savetodb({jsonadd: "addshifts", jsonupdate: "updateshifts", globalobj: $.qsglobal.shifts}, o);};
            o.tr = tr;
            o.fields = [
                {name: "Active", itemname: "active", type: "toggle", defval: "#1", col: 1},
                {name: "Shift", itemname: "name", type: "text", defval: "", col: 1},
                {name: "Description", itemname: "description", type: "text", defval: "", col: 1},
                {name: "Color", itemname: "color", type: "color", defval: "#cc3333", col: 1}, 
                {name: "Location", itemname: "location", type: "location", defval: "", col: 1},
                {name: "Minimum start time", itemname: "starttimel", type: "time", defval: "", col: 2},
                {name: "Maximum start time", itemname: "starttimeu", type: "time", defval: "", col: 2},
                {name: "Minimum duration", itemname: "durationl", type: "time", defval: "", col: 2},
                {name: "Maximum duration", itemname: "durationu", type: "time", defval: "", col: 2},
                {name: "Recurrence", type: "weekdays", col: 2}
            ];
            if(o.ind != -1 && $.qsglobal.breaks != null) {
                o.bottomopts = {          
                    name: "Breaks",
                    attr: "breakid",
                    jsondel: "delbreaks",
                    parentid: o.item.id,
                    parentidname: "shiftid",
                    addfunction: function() {
                        $( "#break-form" ).breakEditScreen({sind: o.ind, sitem: o.item}).dialog( "open" );
                    },
                    editfunction: function(key,val) {
                        $( "#break-form" ).breakEditScreen({ind: key, item: val, sind: o.ind, sitem: o.item}).dialog( "open" );
                    },
                    globalobj: $.qsglobal.breaks, 
                    writeperiod: function(obj) {
                        return '<div class="qstabletag">'+tr("Name")+'</div><div class="qstableval">'+obj.name+
                                '</div><div class="qstabletag">'+tr("Start time")+'</div><div class="qstableval">'+obj.starttimel+' (max: '+obj.starttimeu+')'+
                                '</div><div class="qstabletag">'+tr("Duration")+'</div><div class="qstableval">'+obj.duration+'</div>';
                    }
                };
            }
            return this.each(function() {
                $(this).qsforms(o);
            });
        },
        breakEditScreen: function(opts) {          
            $( this ).empty();        
            
            var defaults = {
                ind: -1,
                sind: -1,
                item: null,
                sitem: null
            };
            
            var o = $.extend(defaults, opts);
            o.reload = function () { $("#shift-form").shiftEditScreen({ind:o.sind, item:o.sitem} ); };
            o.savefunction = function(o) {savetodb({jsonadd: "addbreaks", jsonupdate: "updatebreaks", globalobj: $.qsglobal.breaks}, o);};
            o.tr = tr;
            o.multipletypes = true;
            o.numcol = 1;
            o.width = 25;
            o.prefix="bedit-";
            o.idname = "break-edit";
            o.fields = [
                {name: "Break", itemname: "name", type: "text", defval: "", col: 1},
                {name: "Minimum start time", itemname: "starttimel", type: "time", defval: "", col: 1},
                {name: "Maximum start time", itemname: "starttimeu", type: "time", defval: "", col: 1},
                {name: "Duration", itemname: "duration", type: "time", defval: "", col: 1},
                {name: "Gap from extremities", itemname: "minfromextremities", type: "time", defval: "0:00", col: 1},
                {name: "Gap between breaks", itemname: "minfrombreaks", type: "time", defval: "0:00", col: 1}
            ];
            o.hiddenval = [ {itemname: "shiftid", val: o.sitem.id} ];
            return this.each(function() {
                $(this).qsforms(o);
            });
        }
    });
})(jQuery);

function getshiftsdata(done) {
    $.qsglobal.shifts = null;
    var shiftinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getshifts', shiftinfo, function(data) {
        if(data != null)
            $.qsglobal.shifts = data.slice();
    }, true, done);
    $.qsglobal.breaks = null;
    var breakinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getbreaks', breakinfo, function(data) {
        if(data != null)
            $.qsglobal.breaks = data.slice();
    }, true, null);
}