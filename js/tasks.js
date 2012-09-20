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
        tasksScreen: function(opts) {
            
            var defaults = {
                loff: 0,
                toff: 0
            };
             
            var options = $.extend(defaults, opts);
            
            return this.each(function() { 
                $(this).empty();
                var mobj = $(this);
                var odata = {};
                var i = 0;
                
                $.each($.qsglobal.tasks, function(key,val) {
                    odata[i] = {id: -1, name: '', starttimel:'0:00', startimeu:'0:00',durationl:'0:00',durationu:'0:00', color:'#00f'};
                    odata[i].starttimel = odata[i].starttimeu = val.starttime;
                    odata[i].durationl = odata[i].durationu = val.duration;
                    odata[i].name = val.name;
                    odata[i].color = val.color;
                    odata[i].id = val.id;
                    i++;
                });
                var bbar = $("<div id=\"taskbar\"></div>").appendTo($(this));
                bbar.css('width',$(window).width()-options.loff-20);
                $("<span id=\"taskradioshow\"></span>").html(
                    "<input type=\"radio\" id=\"taskradiotask\" checked=\"checked\" name=\"taskradioshow\"/><label for=\"taskradiotask\">"+tr("Tasks")+"</label>"+
                    "<input type=\"radio\" id=\"taskradiodemand\" name=\"taskradioshow\"/><label for=\"taskradiodemand\">"+tr("Tasks")+"</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                
                $("<span id=\"taskradioassign\"></span>").html(
                    "<input type=\"radio\" id=\"taskradioedit\" checked=\"checked\" name=\"taskradioassign\"/><label for=\"taskradioedit\">"+tr("Edit")+"</label>"+
                    "<input type=\"radio\" id=\"taskradiotag\" name=\"taskradioassign\"/><label for=\"taskradiotag\">"+tr("Tags")+"</label>"+
                    "<input type=\"radio\" id=\"taskradioworker\" name=\"taskradioassign\"/><label for=\"taskradioworker\">"+tr("Workers")+"</label>"+
                    "<input type=\"radio\" id=\"taskradioresource\" name=\"taskradioassign\"/><label for=\"taskradioresource\">"+tr("Resources")+"</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                
                $( "#taskradioedit" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#taskgantt" ).show();
                    $( "#taskslider" ).show();
                    $( "#tasktrash" ).show();
                    $( "#tasknotebutton" ).show();
                    $( "#tasksliderlabel" ).show();
                });
                $( "#taskradiotag" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#taskgantt" ).hide();
                    $( "#taskslider" ).hide();
                    $( "#tasksliderlabel" ).hide();
                    $( "#tasktrash" ).hide();
                    $( "#tasknotebutton" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(mobj);
                    newwin.vMap({
                        type: 5,
                        pos: 1,
                        loff: options.loff,
                        toff: options.toff+67,
                        upobj: $.qsglobal.tasks,
                        upblockclass: 'tblock',
                        uptextclass: 'tblocktext',
                        downobj: $.qsglobal.tags,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                $( "#taskradioworker" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#taskgantt" ).hide();
                    $( "#taskslider" ).hide();
                    $( "#tasksliderlabel" ).hide();
                    $( "#tasktrash" ).hide();
                    $( "#tasknotebutton" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(mobj);
                    newwin.vMap({
                        type: 0,
                        pos: 2,
                        loff: options.loff,
                        toff: options.toff+67,
                        upobj: $.qsglobal.tasks,
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
                $( "#taskradioresource" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#taskgantt" ).hide();
                    $( "#taskslider" ).hide();
                    $( "#tasksliderlabel" ).hide();
                    $( "#tasktrash" ).hide();
                    $( "#tasknotebutton" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(mobj);
                    newwin.vMap({
                        type: 4,
                        pos: 1,
                        loff: options.loff,
                        toff: options.toff+67,
                        upobj: $.qsglobal.tasks,
                        upblockclass: 'tblock',
                        uptextclass: 'tblocktext',
                        downdesc: function(val) {return val.description+' ('+val.capacity+')';},
                        downobj: $.qsglobal.resources,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                
                $("<label id=\"tasksliderlabel\" for=\"taskslider\">"+tr("Zoom")+":</label>").css('margin-left',20).css('margin-top',8).css('float','left').appendTo(bbar);
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
                
                
                $( "<span><button id=\"taskfullscreen\">Fullscreen</button></span>").css('float','right').appendTo(bbar).css('height', '32').css('background', '#a0b4d2')
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
                $( "<span id=\"tasktrash\"><button>Delete</button></span>").css('float','right').appendTo(bbar).css('height', '32')
                    .css('background', '#a0b4d2').button({text: false, icons: {primary: "ui-icon-trash"}}).click(function() {
                        rem=[];
                        $( ".ui-selected", ".tasklist" ).each(function() {
                            var ind = $("#currtasklist li").index(this)-1;
                            rem.push(ind);
                            var sub=0;
                            $.each(rem, function(key,val) {
                                if(val<ind) {
                                    sub++;
                                }
                            });
                            ind=ind-sub;
                            
                            var taskinfo = {token:$.qsglobal.session_token, id:$( this ).attr( "objid" )};
                            postjson($.qsglobal.dbaddr+'deltasks', taskinfo, function(data) {
                                if(data.success == "true") {
                                    $.qsglobal.tasks.splice(ind,1);
                                } else {
                                    alert(tr("Failed to delete"));
                                }
                            }, false, null);
			});
                        if(!$.qsglobal.isfullscreen) {
                            $("#normalscreen").tasksScreen({loff: 83, toff: 101});
                        } else {
                            $("#screen").tasksScreen();
                        }
                    });
                $( "<span id=\"tasknotebutton\"><button>Add notes</button></span>").css('float','right').appendTo(bbar).css('height', '32')
                    .css('background', '#a0b4d2').button({text: false, icons: {primary: "ui-icon-pencil"}}).click(function() {
                        var donote=true;
                        $( ".ui-selected", ".tasklist" ).each(function() {
                            if(donote) {
                                var item = $.qsglobal.tasks[$("#currtasklist li").index(this)-1];
                                $("#tasknotes").tasknoteEditScreen({item:item}).dialog("option", "title", "Note for task "+item.name).dialog("open");
                                donote=false;
                            }
                        });
                    });
                var obj = $("<div id=\"taskgantt\"></div>").appendTo($(this));
                obj.addClass("ganttcontainer").css('width', $(window).width()-options.loff).css('height', $(window).height()-options.toff-1-65)
                obj.css('overflow-x', 'auto').obj;
                
                
                obj.ganttScreen(
                {
                    data: odata,
                    mult: 1.6,
                    itemname: 'task',
                    currw: $(window).width()-options.loff,
                    hoff: options.toff,
                    moff: 0,
                    onclick: function(name, ind) {
                        $( "#task-form" ).taskEditScreen({ind:ind, item:$.qsglobal.tasks[ind]})
                            .dialog("option", "title", name).dialog("open");
                    }
                });
            });
        },
        tasknoteEditScreen: function(opts) {
            $( this ).empty();
            var defaults = {
                item: null
            };
            var options = $.extend(defaults, opts);
         
            return this.each(function() {
                var o =options;
                var obj = $(this);
                
                var wbar = $("<div id=\"wikibar\"></div>").appendTo($(this));
                wbar.css('width','100%');
                $("<span id=\"wikibuttons\"></span>").html(
                    "<input type=\"radio\" id=\"wikiedit\" checked=\"checked\" name=\"wikibuttons\"/><label for=\"wikiedit\">Edit</label>"+
                    "<input type=\"radio\" id=\"wikiread\" name=\"wikibuttons\"/><label for=\"wikiread\">Read</label>")
                    .css('float','right').css('padding-right','10px').buttonset().appendTo(wbar);
                
                
                obj.css("padding", "0");
            
                var content = $("<div style=\"padding:10px;\"></div>").appendTo(obj);
                $("<textarea id=\"wikieditarea\" style=\"height:70%;border-color:#a0b4d2;border-width:2px\" cols=\"120\" rows=\"30\">Enter note here</textarea>").appendTo(content);
                $("<div id=\"wikireadarea\" style=\"font-size:11px;\">Some text</div>").appendTo(content);
                
                $( "#wikieditarea" ).val(o.item.note);
                $( "#wikieditarea" ).show();
                $( "#wikireadarea" ).hide();
                
                $( "#wikiread" ).button().click(function() {
                    
                    $( "#wikireadarea" ).html($( "#wikieditarea" ).val().wiki2html());
                    $( "#wikieditarea" ).hide();
                    $( "#wikireadarea" ).show();
                    MathJax.Hub.Typeset();
                });
                $( "#wikiedit" ).button().click(function() {
                    $( "#wikieditarea" ).show();
                    $( "#wikireadarea" ).hide();
                });
                
                //$('#markItUp').markItUp(markitupSettings);
                obj.dialog({
                    autoOpen: false,
                    width: 950,
                    //height: 680,
                    modal: true,
                    buttons: {
                        "Save": function() {
                            o.item.note = $( "#wikieditarea" ).val();
                            o.item.token=$.qsglobal.session_token;
                            postjson($.qsglobal.dbaddr+'updatetasks', o.item, function(data) {
                                if(data.success == "true")
                                {
                                    
                                    var link = "mailto:";
                                    var widmap = {};
                                    if($.qsglobal.maps != null) {
                                        $.each($.qsglobal.maps, function(key,val) {
                                            if(val.type == 0 && val.id2 == o.item.id) {
                                                widmap[val.id1] = true;
                                            }
                                        });
                                    }
                                    if($.qsglobal.workers != null) {
                                        $.each($.qsglobal.workers, function(key,val) {
                                            if(widmap[val.id] == true && val.email != null && val.email != "") {
                                                link+=encodeURIComponent(val.email+",");
                                            }
                                        });
                                    }
                                    /*link = link + "?subject=" + encodeURIComponent("Q-opt.com: The note for task "+o.item.name+" has been updated")
                                        + "&body=";
                                    link = link+encodeURIComponent($( "#wikieditarea" ).val().substring(0,1000-link.length)+"\n...");
                                    window.open(link);*/
                                } else {
                                    alert("Save failed.")
                                }
                            }, false, null);
                            
                        },
                        "Exit": function() {
                            $( this ).dialog( "close" );
                        }
                    },                  
                });
            });
        },
        taskEditScreen: function(opts) {          
            $( this ).empty();
            
            //Settings list and the default values
            var defaults = {
                ind: -1,
                item: null
            };    
            var o = $.extend(defaults, opts);
            o.reload = function () { showtasks(); };
            o.idname = "task-edit";
            o.prefix="tedit-";
            o.width = 30;
            o.savefunction = function(o) {savetodb({jsonadd: "addtasks", jsonupdate: "updatetasks", globalobj: $.qsglobal.tasks}, o);};
            o.tr = tr;
            o.fields = [
                {name: "Active", itemname: "active", type: "toggle", defval: "#1", col: 1},
                {name: "Task", itemname: "name", type: "text", defval: "", col: 1},
                {name: "Description", itemname: "description", type: "text", defval: "", col: 1},
                {name: "Color", itemname: "color", type: "color", defval: "#cc3333", col: 1}, 
                {name: "Type", itemname: "type", type: "text", defval: "", col: 1},
                {name: "Location start", itemname: "locationstart", type: "location", defval: "", col: 1},
                {name: "Location start", itemname: "locationend", type: "location", defval: "", col: 1},
                {name: "Start time", itemname: "starttime", type: "time", defval: "", col: 2},
                {name: "Duration", itemname: "duration", type: "time", defval: "", col: 2},
                {name: "Minimum work duration", itemname: "minworkduration", type: "time", defval: "", col: 2},
                {name: "Maximum work duration", itemname: "maxworkduration", type: "time", defval: "", col: 2},
                {name: "Quantity", itemname: "quantity", type: "numeric", defval: "1", col: 2},
                {name: "Recurrence", type: "weekdays", col: 2}
            ];
            if(o.ind != -1 && $.qsglobal.demands != null) {
                o.bottomopts = {          
                    name: "Demands",
                    attr: "demandid",
                    jsondel: "deldemands",
                    parentid: o.item.id,
                    parentidname: "taskid",
                    addfunction: function() {
                        $( "#demand-form" ).demandEditScreen({tind: o.ind, titem: o.item}).dialog( "open" );
                    },
                    editfunction: function(key,val) {
                        $( "#demand-form" ).demandEditScreen({ind: key, item: val, tind: o.ind, titem: o.item}).dialog( "open" );
                    },
                    globalobj: $.qsglobal.demands, 
                    writeperiod: function(obj) {
                        return '</div><div class="qstabletag">'+tr('Start time')+'</div><div class="qstableval">'+obj.starttime
                                +'</div><div class="qstabletag">'+tr('Duration')+'</div><div class="qstableval">'+obj.duration+'</div>'
                                +'</div><div class="qstabletag">'+tr('Qty')+'</div><div class="qstableval">'+obj.quantity+'</div>'
                                +'</div><div class="qstabletag">'+tr('Time needed')+'</div><div class="qstableval">'+obj.timeneeded+'</div>';
                    }
                };
            }
            return this.each(function() {
                $(this).qsforms(o);
            });
        },
        demandEditScreen: function(opts) {          
            $( this ).empty();
            //Settings list and the default values
            var defaults = {
                ind: -1,
                tind: -1,
                item: null,
                titem: null
            };
            var o = $.extend(defaults, opts);
            o.reload = function f() { $("#task-form").taskEditScreen({ind:o.tind, item:o.titem} ); };
            o.savefunction = function(o) {savetodb({jsonadd: "adddemands", jsonupdate: "updatedemands", globalobj: $.qsglobal.demands}, o);};
            o.idname = "demand-edit";
            o.prefix = "dedit-";
            o.tr = tr;
            o.fields = [
                {name: "Start time", itemname: "starttime", type: "time", defval: "", col: 1},
                {name: "Duration", itemname: "duration", type: "time", defval: "", col: 1},
                {name: "Quantity", itemname: "quantity", type: "numeric", defval: "", col: 1},
                {name: "Time needed", itemname: "timeneeded", type: "time", defval: "", col: 1},
            ];
            o.hiddenval = [ {itemname: "taskid", val: o.titem.id} ];
            return this.each(function() {
                $(this).qsforms(o);
            });
        },
        taskresEditScreen: function(opts) {          
            $( this ).empty();
            //Settings list and the default values
            var defaults = {
                item: null,
                ind: -1,
            };
            var o = $.extend(defaults, opts);
            o.reload = function () { $("#task-form").taskEditScreen({ind:o.tind, item:o.titem} ); };
            o.savefunction = function(o) {savetodb({jsonadd: "addmaps", jsonupdate: "updatemaps", globalobj: $.qsglobal.maps}, o);};
            o.idname = "taskres-edit";
            o.prefix = "tredit-";
            o.tr = tr;
            o.width = 45;
            o.fields = [
                {name: "Resource quantity requirement", itemname: "qty", type: "numeric", defval: "", col: 1},
                {name: "Resource utilization start time", itemname: "starttime", type: "time", defval: "", col: 1},
                {name: "Resource utilization duration", itemname: "duration", type: "time", defval: "", col: 1},
            ];
            o.hiddenval = [
                {itemname: "id1", val: o.item.id1},
                {itemname: "id2", val: o.item.id2},
                {itemname: "type", val: o.item.type}
            ];
            return this.each(function() {
                $(this).qsforms(o);
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
    //$.qsglobal.demands = null;
    var demandinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getdemands', demandinfo, function(data) {
        if(data != null)
            $.qsglobal.demands = data.slice();
    }, true, null);
}