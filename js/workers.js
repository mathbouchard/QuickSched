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
                
                $( "<span><button id=\"workerfullscreen\">Fullscreen</button></span>").css('float','right').appendTo(bbar).css('height', '32').css('background', '#a0b4d2')
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
                $( "<span><button id=\"workertrash\">Delete</button></span>").css('float','right').appendTo(bbar).css('height', '32')
                    .css('background', '#a0b4d2').button({text: false, icons: {primary: "ui-icon-trash"}}).click(function() {
                        
                        rem = [];
                        $( ".ui-selected", ".workerlist" ).each(function() {
                            var ind = $("#currworkerlist li").index(this)-1;
                            rem.push(ind);
                            var sub=0;
                            $.each(rem, function(key,val) {
                                if(val<ind) {
                                    sub++;
                                }
                            });
                            ind=ind-sub;
                            
                            var workerinfo = {token:$.qsglobal.session_token, id:$( this ).attr( "workerid" )};
                            postjson($.qsglobal.dbaddr+'delworkers', workerinfo, function(data) {
                                if(data.success == "true")
                                {
                                    $.qsglobal.workers.splice(ind,1);
                                } else {
                                    alert("Delete failed.");
                                }
                            }, false, null);
			});
                        if(!$.qsglobal.isfullscreen) {
                            $("#workers").workersScreen({loff: 83, toff: 101});
                        } else {
                            $("#fullscreen").workersScreen();
                        }
                    });
                
                var ulist = $('<ul class="workerlist" id="currworkerlist"></ul>').appendTo( $( this ) );
         
                if($.qsglobal.workers != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="wblocktext">Add a new worker</div>').addClass("wblock")
                        .click( function() { $( "#worker-form" ).workerEditScreen().dialog( "open" );}).addClass("waddblock").attr("workerid", -1);
                    ulist.append(temp);
                    $.each($.qsglobal.workers, function(key,val) {
                        var imglink = "/img/someone.png";
                        if(val.picturelink != null && val.picturelink != "") {
                            imglink = val.picturelink;  
                        } 
                        temp = $( "<li></li>" ).html('<div class="tcolorblock" style="background:'+val.color+'"><img src="'+imglink+'"></img></div><div class="wblocktext"><h3>'
                            +val.firstname+" "+val.lastname+'</h3>'+val.code+'</div>').addClass("wblock").attr("workerid", val.id)
                            .dblclick( function() {
                                $( "#worker-form" ).workerEditScreen({ind: key, item: val}).dialog( "open" )
                                    .dialog("option", "title", val.firstname+" "+val.lastname).dialog("open");
                            });
                        ulist.append(temp);
                    });
                }
                
                ulist.selectable({ filter: "li", cancel: ".ui-selected, .waddblock" });
            });
        },
        workerEditScreen: function(opts) {          
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
                
                var infirstname = '',
                    inlastname = '',
                    inemail = '',
                    inphone1 = '',
                    inphone2 = '',
                    incode = '',
                    inpicturelink = '',
                    incolor = '#cc3333',
                    inminworkhour = '',
                    inmaxworkhour = '',
                    intargetworkhour = '';
                    inmintimeoff = '';
                    inactive = 'true';
                if(o.ind != -1) {
                    infirstname = (o.item.firstname==null) ? "" : o.item.firstname;
                    inlastname = (o.item.lastname==null) ? "" : o.item.lastname;    
                    inemail = (o.item.email==null) ? "" : o.item.email; 
                    inphone1 = (o.item.phone1==null) ? "" : o.item.phone1;
                    inphone2 = (o.item.phone2==null) ? "" : o.item.phone2;
                    incode = (o.item.code==null) ? "" : o.item.code;
                    inpicturelink = (o.item.picturelink==null) ? "" : o.item.picturelink;
                    incolor = (o.item.color==null) ? "" : o.item.color;
                    inminworkhour = (o.item.minworkhour==null) ? "" : o.item.minworkhour;
                    inmaxworkhour = (o.item.maxworkhour==null) ? "" : o.item.maxworkhour;
                    intargetworkhour = (o.item.targetworkhour==null) ? "" : o.item.targetworkhour;
                    inmintimeoff = (o.item.mintimeoff==null) ? "" : o.item.mintimeoff;
                }
                $(this).css("padding", 0).css("margin", 0);
                var type_log = $('<div id="worker-edit"><div>').appendTo( obj );
                var tdiv = $("<div id=\"we-top\"></div>").css("width", "100%").css("height", "45px").css("padding", 0).css("margin", 0)
                    .css("float","left").appendTo( type_log );
                tdiv.append($('<p class="validateTips">Fill the required fields</p>').css("margin", 10));
                var ldiv = $("<div id=\"we-left\"></div>").css("width", "48%").css("height", "100%").css("padding", "0 10px 0 10px").css("margin", 0)
                    .css("float","left").css("border", "solid").css("border-color", "#aaa").css("border-width", "0px 0px 0px 0px").appendTo( type_log );
                var rdiv = $("<div id=\"we-right\"></div>").css("width", "48%").css("float","left")
                    .css("height", "100%").appendTo( type_log );
                var bdiv = $("<div id=\"we-bottom\"></div>").css("width", "100%").css("padding", 0).css("margin", 0).css("float","left")
                    .css("border", "solid").css("border-color", "#aaa").css("border-width", "0px 0px 0px 0px").appendTo( type_log );
                
                var leavediv = $("<div></div>").addClass("leavediv").appendTo(bdiv);
                var lbar = $("<div id=\"leavebar\"></div>").appendTo(leavediv).css("padding", "5px 0px 0 0px")
                lbar.css('width','100%').css('height','32px');
                $("<div></div>").html("Leaves").css('padding', '5px 0 0 10px').css('margin-right','20px').css('float','left').appendTo(lbar);
                
                $( "<span><button id=\"leaveadd\"></button></span>").css('float','left').appendTo(lbar).css('height', '32').css('background', '#a0b4d2')
                    .button({text: false, icons: {primary: "ui-icon-plusthick"}}).click(function() {
                        $( "#leave-form" ).leaveEditScreen({wind: o.ind, witem: o.item}).dialog( "open" );
                    });
                    
                var ordermap = [];
                
                $( "<span><button id=\"leavetrash\"></button></span>").css('float','left').appendTo(lbar).css('height', '32')
                    .css('background', '#a0b4d2').button({text: false, icons: {primary: "ui-icon-trash"}}).click(function() {
                        rem = [];
                        $( ".ui-selected", ".leavelist" ).each(function() {
                            var ind = $("#currleavelist li").index(this);
                            rem.push(ind);
                            var sub=0;
                            $.each(rem, function(key,val) {
                                if(val<ind) {
                                    sub++;
                                }
                            });
                            ind=ind-sub;
                            var leaveinfo = {token:$.qsglobal.session_token, id:$( this ).attr( "leaveid" )};
                            postjson($.qsglobal.dbaddr+'delleaves', leaveinfo, function(data) {
                                if(data.success == "true")
                                {
                                    $.qsglobal.leaves.splice(ordermap[ind],1);
                                } else {
                                    alert("Delete failed.");
                                }
                            }, false, null);
			});
                        obj.workerEditScreen({ind:options.ind, item:options.item});
                    });
                
                var ulist = $('<ul class="leavelist" id="currleavelist"></ul>').css('height','98%').css('overflow-y', 'scroll').appendTo( leavediv );
                ulist.selectable({ filter: "li", cancel: ".ui-selected" });
                
                var leaveind = 0;
                if(options.ind != -1 && $.qsglobal.leaves != null)
                {
                    $.each($.qsglobal.leaves, function(key,val) {
                        if(val.workerid == options.item.id) {
                            if(val.onetime == "1") {
                                temp = $( "<li></li>" ).html('<div class="qstabletag">From</div><div class="qstableval">'+val.startdate+' '+val.starttime+
                                    '</div><div class="qstabletag">To</div><div class="qstableval">'+val.enddate+' '+val.endtime+'</div>').addClass("qstableline")
                                    .attr("leaveid", val.id).dblclick( function() {
                                        $( "#leave-form" ).leaveEditScreen({ind: key, item: val, wind: o.ind, witem: o.item}).dialog( "open" );
                                    });
                            } else {
                                temp = $( "<li></li>" ).html('<div class="qstabletag">From</div><div class="qstableval">'+val.starttime
                                    +'</div><div class="qstabletag">To</div><div class="qstableval">'+val.endtime+'</div><div class="qstabletag">Recurrence</div>'
                                    +((val.sunday=="1")?'<div class="qstableval">Su</div>':'')+((val.monday=="1")?'<div class="qstableval">Mo</div>':'')
                                    +((val.tuesday=="1")?'<div class="qstableval">Tu</div>':'')+((val.wednesday=="1")?'<div class="qstableval">We</div>':'')
                                    +((val.thursday=="1")?'<div class="qstableval">Th</div>':'')+((val.friday=="1")?'<div class="qstableval">Fr</div>':'')
                                    +((val.saturday=="1")?'<div class="qstableval">Sa</div>':'')).addClass("qstableline").attr("leaveid", val.id)
                                    .dblclick( function() {
                                        $( "#leave-form" ).leaveEditScreen({ind: key, item: val, wind: o.ind, witem: o.item}).dialog( "open" );
                                    });
                            }
                            ulist.append(temp);
                            ordermap.push(leaveind);
                        }
                        leaveind++;
                    });
                }
                
                ldiv.append($('<form></form>').html(
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workerpicturelink">Picture</label>'+
                    '<input type="text" id="workerpicturelink" value="'+inpicturelink+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%"/><br/>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workercolor">Color</label>'+
                    '<input style="display: inline-block;" id="workercolor" value="'+incolor+'"><br/>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workerfirstname">First name</label>'+
                    '<input type="text" id="workerfirstname" value="'+infirstname+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%"/><br/>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workerlastname">Last name</label>'+
                    '<input type="text" id="workerlastname" value="'+inlastname+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workeremail">Email</label>'+
                    '<input type="text" id="workeremail" value="'+inemail+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workercode">Code</label>'+
                    '<input type="text" id="workercode" value="'+incode+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '</fieldset>'));
                
                rdiv.append($('<form></form>').html(
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workerphone1">Phone #1</label>'+
                    '<input type="text" id="workerphone1" value="'+inphone1+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workerphone2">Phone #2</label>'+
                    '<input type="text" id="workerphone2" value="'+inphone2+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workerminworkhour">Minimum work hour</label>'+
                    '<input type="text" id="workerminworkhour" value="'+inminworkhour+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workermaxworkhour">Maximum work hour</label>'+
                    '<input type="text" id="workermaxworkhour" value="'+inmaxworkhour+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workertargetworkhour">Target work hour</label>'+
                    '<input type="text" id="workertargetworkhour" value="'+intargetworkhour+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="workermintimeoff">Minimum time between shifts</label>'+
                    '<input type="text" id="workermintimeoff" value="'+inmintimeoff+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '</fieldset>'));
                
                $("#workercolor").simpleColor({
			border: '1px solid #333333',
			boxHeight: '25px',
			displayColorCode: true
                });
                
                var firstname = $( "#workerfirstname" ),
                    lastname = $( "#workerlastname" ),     
                    email = $( "#workeremail" ),
                    phone1 = $( "#workerphone1" ),
                    phone2 = $( "#workerphone2" ),
                    code = $( "#workercode" ),
                    picturelink = $( "#workerpicturelink" ),
                    color = $( "#workercolor" ),
                    minworkhour = $( "#workerminworkhour" ),
                    maxworkhour = $( "#workermaxworkhour" ),
                    targetworkhour = $( "#workertargetworkhour" ),
                    mintimeoff = $( "#workermintimeoff" ),
                    allFields = $( [] ).add( firstname ).add( lastname ).add( email ).add( phone1 ).add( phone2 ).add( code )
                        .add( picturelink ).add( color ).add( minworkhour ).add( maxworkhour ).add( targetworkhour ).add( mintimeoff ),
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
                            
                            var workerinfo = {
                                token:$.qsglobal.session_token, 
                                firstname:firstname.val(),
                                lastname:lastname.val(),
                                email:email.val(),
                                phone1:phone1.val(),
                                phone2:phone2.val(),
                                code:code.val(),
                                picturelink:picturelink.val(),
                                color: color.val(),
                                minworkhour:minworkhour.val(),
                                maxworkhour:maxworkhour.val(),
                                targetworkhour:targetworkhour.val(),
                                mintimeoff:mintimeoff.val(),            
                                id:-1
                            };
                            if(o.ind==-1) {
                                workerinfo.id = -1;
                                postjson($.qsglobal.dbaddr+'addworkers', workerinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        workerinfo.id = data.id;
                                        $.qsglobal.workers.push(workerinfo);
                                        if(!$.qsglobal.isfullscreen) {
                                            $("#workers").workersScreen({loff: 83, toff: 101});
                                        } else {
                                            $("#fullscreen").workersScreen();
                                        }
                                    } else {
                                        alert("Save failed.")
                                    }
                                }, false, null);
                            } else {
                                workerinfo.id = o.item.id;
                                postjson($.qsglobal.dbaddr+'updateworkers', workerinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        workerinfo.id = o.item.id;
                                        $.qsglobal.workers.splice(o.ind,1,workerinfo);
                                        if(!$.qsglobal.isfullscreen) {
                                            $("#workers").workersScreen({loff: 83, toff: 101});
                                        } else {
                                            $("#fullscreen").workersScreen();
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
        leaveEditScreen: function(opts) {          
            $( this ).empty();
            
            //Settings list and the default values
            var defaults = {
                ind: -1,
                wind: -1,
                item: null,
                witem: null
            };
            var options = $.extend(defaults, opts);
         
            return this.each(function() {
                var o =options;
                var obj = $(this);
                //$(this).css('background', '#a0b4d2');
                
                
                var instartdate = '',
                    instarttime = '',
                    inenddate = '',
                    inendtime = '',
                    inonetime = '0',
                    insunday = '0',
                    inmonday = '0',
                    intuesday = '0',
                    inwednesday = '0',
                    inthursday = '0',
                    infriday = '0';
                    insaturday = '0';
                if(o.ind != -1) {
                    instartdate = o.item.startdate;
                    instarttime = o.item.starttime;
                    inenddate = o.item.enddate;
                    inendtime = o.item.endtime;
                    inonetime = o.item.onetime;
                    insunday = o.item.sunday;
                    inmonday = o.item.monday;
                    intuesday = o.item.tuesday;
                    inwednesday = o.item.wednesday;
                    inthursday = o.item.thursday;
                    infriday = o.item.friday;
                    insaturday = o.item.saturday;
                }
                var type_log = $('<div id="leave-edit"><div>').appendTo( obj );
                type_log.append($('<p class="validateTips">Fill the required fields</p>'));
                type_log.append($('<form></form>').html(
                    '<div id="leavetypechoice">'
                        +(o.ind != -1 && o.item.onetime=="0"?
                          '<input type="radio" id="onetimechoice" name="radio" /><label for="onetimechoice">One time</label>':
                          '<input type="radio" id="onetimechoice" name="radio" checked="checked" /><label for="onetimechoice">One time</label>')
                        +(o.ind != -1 && o.item.onetime=="0"?
                          '<input type="radio" id="recurrentchoice" name="radio" checked="checked" /><label for="recurrentchoice">Recurrent</label>':
                          '<input type="radio" id="recurrentchoice" name="radio" /><label for="recurrentchoice">Recurrent</label>')
                    +'</div>'
                    +'<div id="leaveonetime">'
                        +'<label style="display: inline-block; width: 30%; height: 25px;" for="leavestartdate">Start date</label>'
                        +'<input style="display: inline-block;" id="leavestartdate" value="'+instartdate+'"><br/>'
                        +'<label style="display: inline-block; width: 30%; height: 25px;" for="leavestarttime">Start time</label>'
                        +'<input style="display: inline-block;" id="leavestarttime" value=""><br/>'
                        +'<label style="display: inline-block; width: 30%; height: 25px;" for="leaveenddate">End date</label>'
                        +'<input style="display: inline-block;" id="leaveenddate" value="'+inenddate+'"><br/>'
                        +'<label style="display: inline-block; width: 30%; height: 25px;" for="leaveendtime">End time</label>'
                        +'<input style="display: inline-block;" id="leaveendtime" value=""><br/>'
                    +'</div>'
                    +'<div id="leavereccurent">'
                        +'<label style="display: inline-block; width: 30%; height: 25px;" for="rleavestarttime">Start time</label>'
                        +'<input style="display: inline-block;" id="rleavestarttime" value=""><br/>'
                        +'<label style="display: inline-block; width: 30%; height: 25px;" for="rleaveendtime">End time</label>'
                        +'<input style="display: inline-block;" id="rleaveendtime" value=""><br/>'
                        +'<div id="leaveweekday">'
                            +(o.ind != -1 && o.item.sunday=="1"?
                                '<input type="checkbox" id="leavesunday" value="1" checked="checked"/><label for="leavesunday">Su</label>':
                                '<input type="checkbox" id="leavesunday" value="0"/><label for="leavesunday">Su</label>')
                            +(o.ind != -1 && o.item.monday=="1"?
                                '<input type="checkbox" id="leavemonday" value="1" checked="checked"/><label for="leavemonday">Mo</label>':
                                '<input type="checkbox" id="leavemonday" value="0"/><label for="leavemonday">Mo</label>')
                            +(o.ind != -1 && o.item.tuesday=="1"?
                                '<input type="checkbox" id="leavetuesday" value="1" checked="checked"/><label for="leavetuesday">Tu</label>':
                                '<input type="checkbox" id="leavetuesday" value="0"/><label for="leavetuesday">Tu</label>')
                            +(o.ind != -1 && o.item.wednesday=="1"?
                                '<input type="checkbox" id="leavewednesday" value="1" checked="checked"/><label for="leavewednesday">We</label>':
                                '<input type="checkbox" id="leavewednesday" value="0"/><label for="leavewednesday">We</label>')
                            +(o.ind != -1 && o.item.thursday=="1"?
                                '<input type="checkbox" id="leavethursday" value="1" checked="checked"/><label for="leavethursday">Th</label>':
                                '<input type="checkbox" id="leavethursday" value="0"/><label for="leavethursday">Th</label>')
                            +(o.ind != -1 && o.item.friday=="1"?
                                '<input type="checkbox" id="leavefriday" value="1" checked="checked"/><label for="leavefriday">Fr</label>':
                                '<input type="checkbox" id="leavefriday" value="0"/><label for="leavefriday">Fr</label>')
                            +(o.ind != -1 && o.item.saturday=="1"?
                                '<input type="checkbox" id="leavesaturday" value="1" checked="checked"/><label for="leavesaturday">Sa</label>':
                                '<input type="checkbox" id="leavesaturday" value="0"/><label for="leavesaturday">Sa</label>')
                        +'</div>'
                    +'</div>'
                ));
                $( "#leavetypechoice" ).buttonset();
                $( "#leaveweekday" ).buttonset();
                
                var onetime="1";
                if(o.ind != -1 && o.item.onetime=="0") {
                    $( "#leaveonetime" ).hide();
                    $( "#leavereccurent" ).show();
                    $( "#rleavestarttime" ).val(instarttime);
                    $( "#rleaveendtime" ).val(inendtime);
                    onetime="0";
                } else {
                    $( "#leaveonetime" ).show();
                    $( "#leavereccurent" ).hide();
                    $( "#leavestarttime" ).val(instarttime);
                    $( "#leaveendtime" ).val(inendtime);
                    onetime="1";
                }
                
                
                $( "#leavesunday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#leavemonday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#leavetuesday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#leavewednesday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#leavethursday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#leavefriday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#leavesaturday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                
                $( "#onetimechoice" ).button().click(function() {
                    $( "#leaveonetime" ).show();
                    $( "#leavereccurent" ).hide();
                    $( "#rleavestarttime" ).val('');
                    $( "#rleaveendtime" ).val('');
                    onetime="1";
                });
                $( "#recurrentchoice" ).button().click(function() {
                    $( "#leaveonetime" ).hide();
                    $( "#leavereccurent" ).show();
                    $( "#leavestarttime" ).val('');
                    $( "#leaveendtime" ).val('');
                    onetime="0";
                });
                
                var startdate = $( "#leavestartdate" ),
                    starttime = $( "#leavestarttime" )
                    rstarttime = $( "#rleavestarttime" ),
                    enddate = $( "#leaveenddate" ),
                    endtime = $( "#leaveendtime" ),
                    rendtime = $( "#rleaveendtime" ),
                    sunday = $( "#leavesunday" ),
                    monday = $( "#leavemonday" ),
                    tuesday = $( "#leavetuesday" ),
                    wednesday = $( "#leavewednesday" ),
                    thursday = $( "#leavethursday" ),
                    friday = $( "#leavefriday" ),
                    saturday = $( "#leavesaturday" ),
                    allFields = $( [] ).add( startdate ).add( starttime ).add( rstarttime ).add( enddate ).add( endtime ).add( rendtime ).add( sunday )
                        .add( monday ).add( tuesday ).add( wednesday ).add( thursday ).add( friday ).add( saturday ),
                    tips = $( ".validateTips" );
                 
                obj.dialog({
		    autoOpen: false,
		    width: 750,
		    modal: true,
		    buttons: {
                        "Save": function() {
                            var bValid = true;
                            allFields.removeClass( "ui-state-error" );
                            var leaveinfo = {
                                token:$.qsglobal.session_token,
                                startdate:startdate.val(),
                                starttime:starttime.val()+rstarttime.val(),
                                enddate:enddate.val(),
                                endtime:endtime.val()+rendtime.val(),
                                onetime:onetime,
                                sunday:sunday.val(),
                                monday:monday.val(),
                                tuesday:tuesday.val(),
                                wednesday:wednesday.val(),
                                thursday:thursday.val(),
                                friday:friday.val(),
                                saturday:saturday.val(),
                                workerid:o.witem.id,
                                id:""
                            };
                            
                            if(o.ind==-1) {
                                leaveinfo.id = -1;
                                postjson($.qsglobal.dbaddr+'addleaves', leaveinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        leaveinfo.id = data.id;
                                        $.qsglobal.leaves.push(leaveinfo);
                                        $("#worker-form").workerEditScreen({ind:o.wind, item:o.witem} );
                                    } else {
                                        alert("Save failed.")
                                    }
                                }, false, null);
                            } else {
                                leaveinfo.id = o.item.id;
                                postjson($.qsglobal.dbaddr+'updateleaves', leaveinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        $.qsglobal.leaves.splice(o.ind,1,leaveinfo);
                                        $("#worker-form").workerEditScreen({ind:o.wind, item:o.witem} );
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

function getworkersdata(done) {
    $.qsglobal.workers = null;
    var workerinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getworkers', workerinfo, function(data) {
        if(data != null)
            $.qsglobal.workers = data.slice();
    }, true, done);
    $.qsglobal.leaves = null;
    var leaveinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getleaves', leaveinfo, function(data) {
        if(data != null)
            $.qsglobal.leaves = data.slice();
    }, true, null);
}