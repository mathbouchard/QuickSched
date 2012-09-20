/*
 * QuickSchedule Workers jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://skdit.com
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
                    "<input type=\"radio\" id=\"workerradioedit\" checked=\"checked\" name=\"workerradioassign\"/><label for=\"workerradioedit\">"+tr("Edit")+"</label>"+
                    "<input type=\"radio\" id=\"workerradiotag\" name=\"workerradioassign\"/><label for=\"workerradiotag\">"+tr("Tags")+"</label>"+
                    "<input type=\"radio\" id=\"workerradiotask\" name=\"workerradioassign\"/><label for=\"workerradiotask\">"+tr("Tasks")+"</label>"+
                    "<input type=\"radio\" id=\"workerradioshift\" name=\"workerradioassign\"/><label for=\"workerradioshift\">"+tr("Shifts")+"</label>")//+
                    //"<input type=\"radio\" id=\"workerradioresource\" name=\"workerradioassign\"/><label for=\"workerradioresource\">Resources</label>")
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
                /*$( "#workerradioresource" ).button().click(function() {
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
                });*/
                
                $( "<span><button id=\"workerfullscreen\">Fullscreen</button></span>").css('float','right').appendTo(bbar).css('height', '32').css('background', '#a0b4d2')
                    .button({text: false, icons: {primary: "ui-icon-arrowthick-2-ne-sw"}}).click(function() {
                        if(!$.qsglobal.isfullscreen) {
                            $.qsglobal.isfullscreen = true;
                            $("#normalscreen").empty();
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
                            $("#normalscreen").workersScreen({loff: 83, toff: 101});
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
                                    alert("Failed to delete.");
                                }
                            }, false, null);
			});
                        if(!$.qsglobal.isfullscreen) {
                            $("#normalscreen").workersScreen({loff: 83, toff: 101});
                        } else {
                            $("#fullscreen").workersScreen();
                        }
                    });
                
                var ulist = $('<ul class="workerlist" id="currworkerlist"></ul>').appendTo( $( this ) );
         
                if($.qsglobal.workers != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="wblocktext">'+tr("Add a new worker")+'</div>').addClass("wblock")
                        .click( function() { $( "#worker-form" ).attr("title", tr("New worker")).workerEditScreen().dialog( "open" );}).addClass("waddblock").attr("workerid", -1);
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
                item: null,
                ind: -1,
            };
            var o = $.extend(defaults, opts);
            o.reload = function () { showworkers(); };
            o.idname = "worker-edit";
            o.prefix="wedit-";
            o.width = 40;
            o.savefunction = function(o) {savetodb({jsonadd: "addworkers", jsonupdate: "updateworkers", globalobj: $.qsglobal.workers}, o);};
            o.tr = tr;
            o.fields = [
                {name: "Active", itemname: "active", type: "toggle", defval: "#1", col: 1},
                {name: "Color", itemname: "color", type: "color", defval: "#cc3333", col: 1},
                {name: "First name", itemname: "firstname", type: "text", defval: "", col: 1},
                {name: "Last name", itemname: "lastname", type: "text", defval: "", col: 1},
                {name: "Picture", itemname: "picturelink", type: "text", defval: "", col: 1},
                {name: "Email", itemname: "email", type: "text", defval: "", col: 1},
                {name: "Code", itemname: "code", type: "text", defval: "", col: 1},
                {name: "Phone #1", itemname: "phone1", type: "text", defval: "", col: 2},
                {name: "Phone #2", itemname: "phone2", type: "text", defval: "", col: 2},
                {name: "Minimum weekly hour", itemname: "minworkhour", type: "time", defval: "", col: 2},
                {name: "Maximum weekly hour", itemname: "maxworkhour", type: "time", defval: "", col: 2},
                {name: "Target weekly hour", itemname: "targetworkhour", type: "time", defval: "", col: 2},
                {name: "Minimum time between shifts", itemname: "mintimeoff", type: "time", defval: "", col: 2}
            ];
            if(o.ind != -1 && $.qsglobal.leaves != null) {
                o.bottomopts = {          
                    name: "Leaves",
                    attr: "leaveid",
                    jsondel: "delleaves",
                    parentid: o.item.id,
                    parentidname: "workerid",
                    addfunction: function() {
                        $( "#leave-form" ).leaveEditScreen({wind: o.ind, witem: o.item}).dialog( "open" );
                    },
                    editfunction: function(key,val) {
                        $( "#leave-form" ).leaveEditScreen({ind: key, item: val, wind: o.ind, witem: o.item}).dialog( "open" );
                    },
                    globalobj: $.qsglobal.leaves, 
                    writeperiod: function(obj) {
                        if(obj.onetime == "1") {
                            return '<div class="qstabletag">From</div><div class="qstableval">'+obj.startdate+' '+obj.starttime
                                    +'</div><div class="qstabletag">To</div><div class="qstableval">'+obj.enddate+' '+obj.endtime+'</div>';
                        } else {
                            return '<div class="qstabletag">From</div><div class="qstableval">'+obj.starttime
                                    +'</div><div class="qstabletag">To</div><div class="qstableval">'+obj.endtime+'</div><div class="qstabletag">Recurrence</div>'
                                    +((obj.weekdays%64!=obj.weekdays)?'<div class="qstableval">Su</div>':'')+((obj.weekdays%32!=obj.weekdays%64)?'<div class="qstableval">Mo</div>':'')
                                    +((obj.weekdays%16!=obj.weekdays%32)?'<div class="qstableval">Tu</div>':'')+((obj.weekdays%8!=obj.weekdays%16)?'<div class="qstableval">We</div>':'')
                                    +((obj.weekdays%4!=obj.weekdays%8)?'<div class="qstableval">Th</div>':'')+((obj.weekdays%2!=obj.weekdays%4)?'<div class="qstableval">Fr</div>':'')
                                    +((obj.weekdays%2==1)?'<div class="qstableval">Sa</div>':'');
                        }
                    }
                };
            }
            return this.each(function() {
                $(this).qsforms(o);
            });
        },
        leaveEditScreen: function(opts) {          
            $( this ).empty();
            //Settings list and the default values
            var defaults = {
                ind: -1,
                item: null,
                wind: -1,
                witem: null
            };
            $( this ).empty();
            var o = $.extend(defaults, opts);
            o.reload = function () { $("#worker-form").workerEditScreen({ind:o.wind, item:o.witem} ); };
            o.savefunction = function(o) {savetodb({jsonadd: "addleaves", jsonupdate: "updateleaves", globalobj: $.qsglobal.leaves}, o);};
            o.tr = tr;
            o.multipletypes = true;
            o.numcol = 1;
            o.prefix="ledit-";
            o.idname = "leave-edit";
            o.fields = [
                {type: "multitype", col: 1, multipletypes: [{name: "Recurrent"},{name: "One time"}], typechoice: (o.item==null?0:o.item.onetime), choicenum: "-1", choicename: "onetime"},
                {name: "Start date", itemname: "startdate", type: "date", defval: "", col: 1, choicenum: "1"},
                {name: "Start time", itemname: "starttime", type: "time", defval: "", col: 1, choicenum: "-1"},
                {name: "End date", itemname: "enddate", type: "date", defval: "", col: 1, choicenum: "1"},
                {name: "End time", itemname: "endtime", type: "date", defval: "", col: 1, choicenum: "-1"},
                {type: "weekdays", col: 1, choicenum: "0"}
            ];
            o.hiddenval = [ {itemname: "workerid", val: o.witem.id} ];
            return this.each(function() {
                $(this).qsforms(o);
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