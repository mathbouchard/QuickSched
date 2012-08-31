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
                mobj = $(this);
                
                var bbar = $("<div id=\"shiftbar\"></div>").appendTo($(this));
                bbar.css('width',$(window).width()-options.loff-20);
                
                $("<span id=\"shiftradioassign\"></span>").html(
                    "<input type=\"radio\" id=\"shiftradioedit\" checked=\"checked\" name=\"shiftradioassign\"/><label for=\"shiftradioedit\">Edit</label>"+
                    "<input type=\"radio\" id=\"shiftradiotag\" name=\"shiftradioassign\"/><label for=\"shiftradiotag\">Tags</label>"+
                    "<input type=\"radio\" id=\"shiftradioworker\" name=\"shiftradioassign\"/><label for=\"shiftradioworker\">Workers</label>")
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
                    
                $("<label id=\"shiftsliderlabel\" for=\"shiftslider\">Zoom:</label>").css('margin-left',20).css('margin-top',8).css('float','left').appendTo(bbar);
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
                            
                            var shiftinfo = {token:$.qsglobal.session_token, id:$( this ).attr( "objid" )};
                            postjson($.qsglobal.dbaddr+'delshifts', shiftinfo, function(data) {
                                if(data.success == "true") {
                                    $.qsglobal.shifts.splice(ind,1);
                                } else {
                                    alert("Delete failed.");
                                }
                            }, false, null);
			});
                        if(!$.qsglobal.isfullscreen) {
                            $("#shifts").shiftsScreen({loff: 83, toff: 101});
                        } else {
                            $("#fullscreen").shiftsScreen();
                        }
                    });
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
            var options = $.extend(defaults, opts);
         
            return this.each(function() {
                var o =options;
                var obj = $(this);
                
                var inname = '',
                    indescription = '',
                    incolor = '#cc3333',
                    inlocation = '',
                    instarttimel = '',
                    instarttimeu = '',
                    indurationl = '',
                    indurationu = '',
                    insunday = '0';
                    inmonday = '0';
                    intuesday = '0';
                    inwednesday = '0';
                    inthursday = '0';
                    infriday = '0';
                    insaturday = '0';
                    inactive = '0';
                if(o.ind != -1) {
                    inname = (o.item.name==null) ? "" : o.item.name;
                    indescription = (o.item.description==null) ? "" : o.item.description;    
                    incolor = (o.item.color==null) ? "" : o.item.color;
                    inlocation = (o.item.location==null) ? "" : o.item.location;
                    instarttimel = (o.item.starttimel==null) ? "" : o.item.starttimel;
                    instarttimeu = (o.item.starttimeu==null) ? "" : o.item.starttimeu;
                    indurationl = (o.item.durationl==null) ? "" : o.item.durationl;
                    indurationu = (o.item.durationu==null) ? "" : o.item.durationu;
                    insunday = (o.item.sunday==null) ? "" : o.item.sunday;
                    inmonday = (o.item.monday==null) ? "" : o.item.monday;
                    intuesday = (o.item.tuesday==null) ? "" : o.item.tuesday;
                    inwednesday = (o.item.wednesday==null) ? "" : o.item.wednesday;
                    inthursday = (o.item.thursday==null) ? "" : o.item.thursday;
                    infriday = (o.item.friday==null) ? "" : o.item.friday;
                    insaturday = (o.item.saturday==null) ? "" : o.item.saturday;
                    inactive = (o.item.active==null) ? "" : o.item.active;
                }
                $(this).css("padding", 0).css("margin", 0);
                var type_log = $('<div id="shift-edit"><div>').appendTo( obj );
                var tdiv = $("<div id=\"we-top\"></div>").css("width", "100%").css("height", "45px").css("padding", 0).css("margin", 0)
                    .css("float","left").appendTo( type_log );
                tdiv.append($('<p class="validateTips">Fill the required fields</p>').css("margin", 10));
                var ldiv = $("<div id=\"we-left\"></div>").css("width", "48%").css("height", "100%").css("padding", "0 10px 0 10px").css("margin", 0)
                    .css("float","left").css("border", "solid").css("border-color", "#aaa").css("border-width", "0px 0px 0px 0px").appendTo( type_log );
                var rdiv = $("<div id=\"we-right\"></div>").css("width", "48%").css("float","left")
                    .css("height", "100%").appendTo( type_log );
                var bdiv = $("<div id=\"we-bottom\"></div>").css("width", "100%").css("padding", 0).css("margin", 0).css("float","left")
                    .css("border", "solid").css("border-color", "#aaa").css("border-width", "0px 0px 0px 0px").appendTo( type_log );
                
                var breakdiv = $("<div></div>").addClass("breakdiv").appendTo(bdiv);
                var bbar = $("<div id=\"breakbar\"></div>").appendTo(breakdiv).css("padding", "5px 0px 0 0px")
                bbar.css('width','100%').css('height','32px');
                $("<div></div>").html("Breaks").css('padding', '5px 0 0 10px').css('margin-right','20px').css('float','left').appendTo(bbar);
                
                $( "<span><button id=\"breakadd\"></button></span>").css('float','left').appendTo(bbar).css('height', '32').css('background', '#a0b4d2')
                    .button({text: false, icons: {primary: "ui-icon-plusthick"}}).click(function() {
                        $( "#break-form" ).breakEditScreen({sind: o.ind, sitem: o.item}).dialog( "open" );
                    });
                    
                var ordermap = [];
                
                $( "<span><button id=\"breaktrash\"></button></span>").css('float','left').appendTo(bbar).css('height', '32')
                    .css('background', '#a0b4d2').button({text: false, icons: {primary: "ui-icon-trash"}}).click(function() {
                        rem = [];
                        $( ".ui-selected", ".breaklist" ).each(function() {
                            var ind = $("#currbreaklist li").index(this);
                            rem.push(ind);
                            var sub=0;
                            $.each(rem, function(key,val) {
                                if(val<ind) {
                                    sub++;
                                }
                            });
                            ind=ind-sub;
                            var breakinfo = {token:$.qsglobal.session_token, id:$( this ).attr( "breakid" )};
                            postjson($.qsglobal.dbaddr+'delbreaks', breakinfo, function(data) {
                                if(data.success == "true")
                                {
                                    $.qsglobal.breaks.splice(ordermap[ind],1);
                                } else {
                                    alert("Delete failed.");
                                }
                            }, false, null);
			});
                        obj.shiftEditScreen({ind:options.ind, item:options.item});
                    });
                
                var ulist = $('<ul class="breaklist" id="currbreaklist"></ul>').css('height','98%').css('overflow-y', 'scroll').appendTo( breakdiv );
                ulist.selectable({ filter: "li", cancel: ".ui-selected" });
                
                var breakind = 0;
                if($.qsglobal.breaks != null && options.item != null)
                {
                    $.each($.qsglobal.breaks, function(key,val) {
                        if(val.shiftid == options.item.id) {
                            temp = $( "<li></li>" ).html('<div class="qstabletag">Name</div><div class="qstableval">'+val.name+
                                '</div><div class="qstabletag">Start time</div><div class="qstableval">'+val.starttimel+' (max: '+val.starttimeu+')'+
                                '</div><div class="qstabletag">Duration</div><div class="qstableval">'+val.duration+'</div>').addClass("qstableline")
                                .attr("breakid", val.id).dblclick( function() {
                                    $( "#break-form" ).breakEditScreen({ind: key, item: val, sind: o.ind, sitem: o.item}).dialog( "open" );
                                });
                            ulist.append(temp);
                            ordermap.push(breakind);
                        }
                        breakind++;
                    });
                }
                
                if(options.item == null)
                    bdiv.hide();
                
                ldiv.append($('<form></form>').html(
                    (o.ind != -1 && o.item.active=="0"?
                                '<div id="shiftactivechoice"><input type="checkbox" id="shiftactive" value="0" /><label for="shiftactive">Active</label></div>':
                                '<div id="shiftactivechoice"><input type="checkbox" id="shiftactive" value="1" checked="checked"/><label for="shiftactive">Active</label></div>')+
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="shiftname">Task</label>'+
                    '<input type="text" id="shiftname" value="'+inname+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%"/><br/>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="shiftdescription">Description</label>'+
                    '<input type="text" id="shiftdescription" value="'+indescription+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%"/><br/>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="shiftcolor">Color</label>'+
                    '<input style="display: inline-block;" id="shiftcolor" value="'+incolor+'"><br/>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="shiftlocation">Location</label>'+
                    '<input type="button" id="shiftlocation" value="'+inlocation+'" class="button ui-widget-content ui-corner-all" style="display: inline-block; width:55%"/><br />'+
                    '</fieldset>'));
                
                rdiv.append($('<form></form>').html(
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="shiftstarttimel">Start time (min)</label>'+
                    '<input type="text" id="shiftstarttimel" value="'+instarttimel+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="shiftstarttimeu">Start time (max)</label>'+
                    '<input type="text" id="shiftstarttimeu" value="'+instarttimeu+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="shiftdurationl">Duration (min)</label>'+
                    '<input type="text" id="shiftdurationl" value="'+indurationl+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="shiftdurationu">Duration (max)</label>'+
                    '<input type="text" id="shiftdurationu" value="'+indurationu+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '</fieldset>'+
                    '<div style="display: inline-block; width: 40%; height: 25px;">Recurrence</div><div id="shiftweekday" style="float: right;;padding: 0 0 10px 0;">'+
                            (o.ind != -1 && o.item.sunday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="shiftsunday" value="1" checked="checked"/><label for="shiftsunday">Su</label>':
                                '<input type="checkbox" style="display: inline-block;" id="shiftsunday" value="0"/><label for="shiftsunday">Su</label>')+
                            (o.ind != -1 && o.item.monday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="shiftmonday" value="1" checked="checked"/><label for="shiftmonday">Mo</label>':
                                '<input type="checkbox" style="display: inline-block;" id="shiftmonday" value="0"/><label for="shiftmonday">Mo</label>')+
                            (o.ind != -1 && o.item.tuesday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="shifttuesday" value="1" checked="checked"/><label for="shifttuesday">Tu</label>':
                                '<input type="checkbox" style="display: inline-block;" id="shifttuesday" value="0"/><label for="shifttuesday">Tu</label>')+
                            (o.ind != -1 && o.item.wednesday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="shiftwednesday" value="1" checked="checked"/><label for="shiftwednesday">We</label>':
                                '<input type="checkbox" style="display: inline-block;" id="shiftwednesday" value="0"/><label for="shiftwednesday">We</label>')+
                            (o.ind != -1 && o.item.thursday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="shiftthursday" value="1" checked="checked"/><label for="shiftthursday">Th</label>':
                                '<input type="checkbox" style="display: inline-block;" id="shiftthursday" value="0"/><label for="shiftthursday">Th</label>')+
                            (o.ind != -1 && o.item.friday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="shiftfriday" value="1" checked="checked"/><label for="shiftfriday">Fr</label>':
                                '<input type="checkbox" style="display: inline-block;" id="shiftfriday" value="0"/><label for="shiftfriday">Fr</label>')+
                            (o.ind != -1 && o.item.saturday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="shiftsaturday" value="1" checked="checked"/><label for="shiftsaturday">Sa</label>':
                                '<input type="checkbox" style="display: inline-block;" id="shiftsaturday" value="0"/><label for="shiftsaturday">Sa</label>')+
                        '</div>'
                    ));
                
                if($( "#shiftlocation" ).val() == "") {
                    $( "#shiftlocation" ).button().click(function() { $.qsglobal.currcoord = $(this); setmap('0,0',$( "#shiftlocation" ),true);});
                } else {
                    $( "#shiftlocation" ).button().click(function() { $.qsglobal.currcoord = $(this); setmap($( "#shiftlocation" ).val(),$( "#shiftlocation" ),false);});
                }
                
                $( "#shiftactivechoice" ).buttonset();
                $( "#shiftweekday" ).buttonset();
                $("#shiftcolor").simpleColor({
			border: '1px solid #333333',
			boxHeight: '25px',
			displayColorCode: true
                });
                $( "#shiftactive" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#shiftsunday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#shiftmonday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#shifttuesday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#shiftwednesday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#shiftthursday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#shiftfriday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#shiftsaturday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                    
                var name = $( "#shiftname" ),
                    description = $( "#shiftdescription" ),
                    color = $( "#shiftcolor" ),
                    location = $( "#shiftlocation" ),
                    starttimel = $( "#shiftstarttimel" ),
                    starttimeu = $( "#shiftstarttimeu" ),
                    durationl = $( "#shiftdurationl" ),
                    durationu = $( "#shiftdurationu" ),
                    sunday = $( "#shiftsunday" ),
                    monday = $( "#shiftmonday" ),
                    tuesday = $( "#shifttuesday" ),
                    wednesday = $( "#shiftwednesday" ),
                    thursday = $( "#shiftthursday" ),
                    friday = $( "#shiftfriday" ),
                    saturday = $( "#shiftsaturday" ),
                    active = $( "#shiftactive" ),
                    allFields = $( [] ).add( name ).add( description ).add( color ).add( location ).add( starttimel ).add( starttimeu ).add( durationl ).add( durationu )
                        .add( sunday ).add( monday ).add( tuesday ).add( wednesday ).add( thursday ).add( friday ).add( saturday ).add( active ),
                    tips = $( ".validateTips" );
                 
                obj.dialog({
		    autoOpen: false,
		    width: 950,
                    //height: 700,
		    modal: true,
		    buttons: {
                        "Save": function() {
                            var bValid = true;
                            
                            allFields.removeClass( "ui-state-error" );
                            
                            var shiftinfo = {
                                token:$.qsglobal.session_token, 
                                name:name.val(),
                                description:description.val(),
                                color:color.val(),
                                location:location.val(),
                                starttimel:starttimel.val(),
                                starttimeu:starttimeu.val(),
                                durationl:durationl.val(),
                                durationu:durationu.val(),
                                sunday:sunday.val(),
                                monday:monday.val(),
                                tuesday:tuesday.val(),
                                wednesday:wednesday.val(),
                                thursday:thursday.val(),
                                friday:friday.val(),
                                saturday:saturday.val(),
                                active:active.val(),
                                id:-1
                            };
                            if(o.ind==-1) {
                                shiftinfo.id = -1;
                                postjson($.qsglobal.dbaddr+'addshifts', shiftinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        shiftinfo.id = data.id;
                                        $.qsglobal.shifts.push(shiftinfo);
                                        if(!$.qsglobal.isfullscreen) {
                                            $("#shifts").shiftsScreen({loff: 83, toff: 101});
                                        } else {
                                            $("#fullscreen").shiftsScreen();
                                        }
                                    } else {
                                        alert("Save failed.")
                                    }
                                }, false, null);
                            } else {
                                shiftinfo.id = o.item.id;
                                postjson($.qsglobal.dbaddr+'updateshifts', shiftinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        shiftinfo.id = o.item.id;
                                        $.qsglobal.shifts.splice(o.ind,1,shiftinfo);
                                        if(!$.qsglobal.isfullscreen) {
                                            $("#shifts").shiftsScreen({loff: 83, toff: 101});
                                        } else {
                                            $("#fullscreen").shiftsScreen();
                                        }
                                    } else {
                                        alert("Save failed.")
                                    }
                                }, false, null);
                            }
                            
                            $( this ).dialog( "close" );
                        },
                        Cancel: function() {
                            $( this ).dialog( "close" );
                        }
                    },
                    close: function() {
                        allFields.val( "" ).removeClass( "ui-state-error" );
                    }
		});
                 
            });
        },
        breakEditScreen: function(opts) {          
            $( this ).empty();
            
            //Settings list and the default values
            var defaults = {
                ind: -1,
                sind: -1,
                item: null,
                sitem: null
            };
            var options = $.extend(defaults, opts);
         
            return this.each(function() {
                var o =options;
                var obj = $(this);
                //$(this).css('background', '#a0b4d2');
                
                
                var inname = '',
                    instarttimel = '',
                    instarttimeu = '',
                    induration = '';
                    inminfromextremities = '';
                    inminfrombreaks = '';
                if(o.ind != -1) {
                    inname = o.item.name;
                    instarttimel = o.item.starttimel;
                    instarttimeu = o.item.starttimeu;
                    induration = o.item.duration;
                    inminfromextremities = o.item.minfromextremities;
                    inminfrombreaks = o.item.minfrombreaks;
                }
                var type_log = $('<div id="break-edit"><div>').appendTo( obj );
                type_log.append($('<p class="validateTips">Fill the required fields</p>'));
                type_log.append($('<form></form>').html(
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="breakname">Name</label>'+
                    '<input type="text" id="breakname" value="'+inname+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="breakstarttimel">Start time (min)</label>'+
                    '<input type="text" id="breakstarttimel" value="'+instarttimel+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="breakstarttimeu">Start time (max)</label>'+
                    '<input type="text" id="breakstarttimeu" value="'+instarttimeu+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="breakduration">Duration</label>'+
                    '<input type="text" id="breakduration" value="'+induration+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="breakminfromextremities">Gap from extremities</label>'+
                    '<input type="text" id="breakminfromextremities" value="'+inminfromextremities+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="breakminfrombreaks">Gap between breaks</label>'+
                    '<input type="text" id="breakminfrombreaks" value="'+inminfrombreaks+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '</fieldset>'));
                        
                var name = $( "#breakname" ),
                    starttimel = $( "#breakstarttimel" ),
                    starttimeu = $( "#breakstarttimeu" ),
                    duration = $( "#breakduration" ),
                    minfromextremities = $( "#breakminfromextremities" ),
                    minfrombreaks = $( "#breakminfromextremities" ),
                    allFields = $( [] ).add( name ).add( starttimel ).add( starttimeu ).add( duration ).add( minfromextremities ).add( minfrombreaks ),
                    tips = $( ".validateTips" );
                 
                obj.dialog({
		    autoOpen: false,
		    width: 750,
		    modal: true,
		    buttons: {
                        "Save": function() {
                            var bValid = true;
                            
                            allFields.removeClass( "ui-state-error" );
                            
                            var breakinfo = {
                                token:$.qsglobal.session_token,
                                name:name.val(),
                                starttimel:starttimel.val(),
                                starttimeu:starttimeu.val(),
                                duration:duration.val(),
                                minfromextremities:minfromextremities.val(),
                                minfrombreaks:minfrombreaks.val(),
                                shiftid:o.sitem.id,
                                id:""
                            };
                            if(o.ind==-1) {
                                breakinfo.id = -1;
                                postjson($.qsglobal.dbaddr+'addbreaks', breakinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        breakinfo.id = data.id;
                                        $.qsglobal.breaks.push(breakinfo);
                                        $("#shift-form").shiftEditScreen({ind:o.sind, item:o.sitem} );
                                    } else {
                                        alert("Save failed.")
                                    }
                                }, false, null);
                            } else {
                                breakinfo.id = o.item.id;
                                postjson($.qsglobal.dbaddr+'updatebreaks', breakinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        breakinfo.id = o.item.id;
                                        $.qsglobal.breaks.splice(o.ind,1,breakinfo);
                                        $("#shift-form").shiftEditScreen({ind:o.sind, item:o.sitem} );
                                    } else {
                                        alert("Save failed.")
                                    }
                                }, false, null);
                            }
                            
                            $( this ).dialog( "close" );
                        },
                        Cancel: function() {
                            $( this ).dialog( "close" );
                        }
                    },
                    close: function() {
                        allFields.val( "" ).removeClass( "ui-state-error" );
                    }
		});
                 
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