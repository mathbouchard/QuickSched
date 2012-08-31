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
                    "<input type=\"radio\" id=\"taskradiotask\" checked=\"checked\" name=\"taskradioshow\"/><label for=\"taskradiotask\">Tasks</label>"+
                    "<input type=\"radio\" id=\"taskradiodemand\" name=\"taskradioshow\"/><label for=\"taskradiodemand\">Demands</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                
                $("<span id=\"taskradioassign\"></span>").html(
                    "<input type=\"radio\" id=\"taskradioedit\" checked=\"checked\" name=\"taskradioassign\"/><label for=\"taskradioedit\">Edit</label>"+
                    "<input type=\"radio\" id=\"taskradiotag\" name=\"taskradioassign\"/><label for=\"taskradiotag\">Tags</label>"+
                    "<input type=\"radio\" id=\"taskradioworker\" name=\"taskradioassign\"/><label for=\"taskradioworker\">Workers</label>"+
                    "<input type=\"radio\" id=\"taskradioresource\" name=\"taskradioassign\"/><label for=\"taskradioresource\">Resources</label>")
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
                        downdesc: function(val) {return val.desc+' ('+val.capacity+')';},
                        downobj: $.qsglobal.resources,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                
                $("<label id=\"tasksliderlabel\" for=\"taskslider\">Zoom:</label>").css('margin-left',20).css('margin-top',8).css('float','left').appendTo(bbar);
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
                                    alert("Delete failed.");
                                }
                            }, false, null);
			});
                        if(!$.qsglobal.isfullscreen) {
                            $("#tasks").tasksScreen({loff: 83, toff: 101});
                        } else {
                            $("#fullscreen").tasksScreen();
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
                obj.addClass("ganttcontainer").css('width', $(window).width()-options.loff).css('height', $(window).height()-options.toff-1-65);
                
                
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
            var options = $.extend(defaults, opts);
         
            return this.each(function() {
                var o =options;
                var obj = $(this);
                
                var inname = '',
                    indescription = '',
                    incolor = '#cc3333',
                    intype = '',
                    inlocationstart = '',
                    inlocationend = '',
                    instarttime = '',
                    induration = '',
                    inminworkduration = '',
                    inmaxworkduration = '',
                    inqty = '';
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
                    intype = (o.item.type==null) ? "" : o.item.type;
                    inlocationstart = (o.item.locationstart==null) ? "" : o.item.locationstart;
                    inlocationend = (o.item.locationend==null) ? "" : o.item.locationend;
                    instarttime = (o.item.starttime==null) ? "" : o.item.starttime;
                    induration = (o.item.duration==null) ? "" : o.item.duration;
                    inminworkduration = (o.item.minworkduration==null) ? "" : o.item.minworkduration;
                    inmaxworkduration = (o.item.maxworkduration==null) ? "" : o.item.maxworkduration;
                    inqty = (o.item.qty==null) ? "" : o.item.qty;
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
                var type_log = $('<div id="task-edit"><div>').appendTo( obj );
                var tdiv = $("<div id=\"we-top\"></div>").css("width", "100%").css("height", "45px").css("padding", 0).css("margin", 0)
                    .css("float","left").appendTo( type_log );
                tdiv.append($('<p class="validateTips">Fill the required fields</p>').css("margin", 10));
                var ldiv = $("<div id=\"we-left\"></div>").css("width", "48%").css("height", "100%").css("padding", "0 10px 0 10px").css("margin", 0)
                    .css("float","left").css("border", "solid").css("border-color", "#aaa").css("border-width", "0px 0px 0px 0px").appendTo( type_log );
                var rdiv = $("<div id=\"we-right\"></div>").css("width", "48%").css("float","left")
                    .css("height", "100%").appendTo( type_log );
                var bdiv = $("<div id=\"we-bottom\"></div>").css("width", "100%").css("padding", 0).css("margin", 0).css("float","left")
                    .css("border", "solid").css("border-color", "#aaa").css("border-width", "0px 0px 0px 0px").appendTo( type_log );
                
                var demanddiv = $("<div></div>").addClass("demanddiv").appendTo(bdiv);
                var bbar = $("<div id=\"demandbar\"></div>").appendTo(demanddiv).css("padding", "5px 0px 0 0px")
                bbar.css('width','100%').css('height','32px');
                $("<div></div>").html("Demands").css('padding', '5px 0 0 10px').css('margin-right','20px').css('float','left').appendTo(bbar);
                
                $( "<span><button id=\"demandadd\"></button></span>").css('float','left').appendTo(bbar).css('height', '32').css('background', '#a0b4d2')
                    .button({text: false, icons: {primary: "ui-icon-plusthick"}}).click(function() {
                        $( "#demand-form" ).demandEditScreen({tind: o.ind, titem: o.item}).dialog( "open" );
                    });
                    
                var ordermap = [];
                
                $( "<span><button id=\"demandtrash\"></button></span>").css('float','left').appendTo(bbar).css('height', '32')
                    .css('background', '#a0b4d2').button({text: false, icons: {primary: "ui-icon-trash"}}).click(function() {
                        rem = [];
                        $( ".ui-selected", ".demandlist" ).each(function() {
                            var ind = $("#currdemandlist li").index(this);
                            rem.push(ind);
                            var sub=0;
                            $.each(rem, function(key,val) {
                                if(val<ind) {
                                    sub++;
                                }
                            });
                            ind=ind-sub;
                            var demandinfo = {token:$.qsglobal.session_token, id:$( this ).attr( "demandid" )};
                            postjson($.qsglobal.dbaddr+'deldemands', demandinfo, function(data) {
                                if(data.success == "true")
                                {
                                    $.qsglobal.demands.splice(ordermap[ind],1);
                                } else {
                                    alert("Delete failed.");
                                }
                            }, false, null);
			});
                        obj.taskEditScreen({ind:options.ind, item:options.item});
                    });
                
                var ulist = $('<ul class="demandlist" id="currdemandlist"></ul>').css('height','98%').css('overflow-y', 'scroll').appendTo( demanddiv );
                ulist.selectable({ filter: "li", cancel: ".ui-selected" });
                
                var demandind = 0;
                if($.qsglobal.demands != null && options.item != null)
                {
                    $.each($.qsglobal.demands, function(key,val) {
                        if(val.taskid == options.item.id) {
                            temp = $( "<li></li>" ).html('</div><div class="qstabletag">Start time</div><div class="qstableval">'+val.starttime
                                +'</div><div class="qstabletag">Duration</div><div class="qstableval">'+val.duration+'</div>'
                                +'</div><div class="qstabletag">Qty</div><div class="qstableval">'+val.quantity+'</div>'
                                +'</div><div class="qstabletag">Time needed</div><div class="qstableval">'+val.timeneeded+'</div>'
                                ).addClass("qstableline").attr("demandid", val.id).dblclick( function() {
                                    $( "#demand-form" ).demandEditScreen({ind: key, item: val, tind: o.ind, titem: o.item}).dialog( "open" );
                                });
                            ulist.append(temp);
                            ordermap.push(demandind);
                        }
                        demandind++;
                    });
                }
                
                if(options.item == null)
                    bdiv.hide();
                
                ldiv.append($('<form></form>').html(
                    (o.ind != -1 && o.item.active=="0"?
                                '<div id="taskactivechoice"><input type="checkbox" id="taskactive" value="0" /><label for="taskactive">Active</label></div>':
                                '<div id="taskactivechoice"><input type="checkbox" id="taskactive" value="1" checked="checked"/><label for="taskactive">Active</label></div>')+
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="taskname">Task</label>'+
                    '<input type="text" id="taskname" value="'+inname+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%"/><br/>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="taskdescription">Description</label>'+
                    '<input type="text" id="taskdescription" value="'+indescription+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%"/><br/>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="taskcolor">Color</label>'+
                    '<input style="display: inline-block;" id="taskcolor" value="'+incolor+'"><br/>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="tasktype">Type</label>'+
                    '<input type="text" id="tasktype" value="'+intype+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%"/><br/>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="tasklocationstart">Location start</label>'+
                    '<input type="button" id="tasklocationstart" value="'+inlocationstart+'" class="button ui-widget-content ui-corner-all" style="display: inline-block; width:55%"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="tasklocationend">Location end</label>'+
                    '<input type="button" id="tasklocationend" value="'+inlocationend+'" class="button ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '</fieldset>'));
                
                rdiv.append($('<form></form>').html(
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="taskstarttime">Start time</label>'+
                    '<input type="text" id="taskstarttime" value="'+instarttime+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="taskduration">Duration</label>'+
                    '<input type="text" id="taskduration" value="'+induration+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="taskminworkduration">Minimum work duration</label>'+
                    '<input type="text" id="taskminworkduration" value="'+inminworkduration+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="taskmaxworkduration">Maximum work duration</label>'+
                    '<input type="text" id="taskmaxworkduration" value="'+inmaxworkduration+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '<label style="display: inline-block; width: 40%; height: 25px;" for="taskqty">Quantity</label>'+
                    '<input type="text" id="taskqty" value="'+inqty+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:55%;"/><br />'+
                    '</fieldset>'+
                    '<div style="display: inline-block; width: 40%; height: 25px;">Recurrence</div><div id="taskweekday" style="float: right;padding: 0 0 10px 0;">'+
                            (o.ind != -1 && o.item.sunday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="tasksunday" value="1" checked="checked"/><label for="tasksunday">Su</label>':
                                '<input type="checkbox" style="display: inline-block;" id="tasksunday" value="0"/><label for="tasksunday">Su</label>')+
                            (o.ind != -1 && o.item.monday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="taskmonday" value="1" checked="checked"/><label for="taskmonday">Mo</label>':
                                '<input type="checkbox" style="display: inline-block;" id="taskmonday" value="0"/><label for="taskmonday">Mo</label>')+
                            (o.ind != -1 && o.item.tuesday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="tasktuesday" value="1" checked="checked"/><label for="tasktuesday">Tu</label>':
                                '<input type="checkbox" style="display: inline-block;" id="tasktuesday" value="0"/><label for="tasktuesday">Tu</label>')+
                            (o.ind != -1 && o.item.wednesday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="taskwednesday" value="1" checked="checked"/><label for="taskwednesday">We</label>':
                                '<input type="checkbox" style="display: inline-block;" id="taskwednesday" value="0"/><label for="taskwednesday">We</label>')+
                            (o.ind != -1 && o.item.thursday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="taskthursday" value="1" checked="checked"/><label for="taskthursday">Th</label>':
                                '<input type="checkbox" style="display: inline-block;" id="taskthursday" value="0"/><label for="taskthursday">Th</label>')+
                            (o.ind != -1 && o.item.friday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="taskfriday" value="1" checked="checked"/><label for="taskfriday">Fr</label>':
                                '<input type="checkbox" style="display: inline-block;" id="taskfriday" value="0"/><label for="taskfriday">Fr</label>')+
                            (o.ind != -1 && o.item.saturday=="1"?
                                '<input type="checkbox" style="display: inline-block;" id="tasksaturday" value="1" checked="checked"/><label for="tasksaturday">Sa</label>':
                                '<input type="checkbox" style="display: inline-block;" id="tasksaturday" value="0"/><label for="tasksaturday">Sa</label>')+
                        '</div>'
                    ));
                
                if($( "#tasklocationstart" ).val() == "") {
                    $( "#tasklocationstart" ).button().click(function() { $.qsglobal.currcoord = $(this); setmap('0,0',$( "#tasklocationstart" ),true);});
                } else {
                    $( "#tasklocationstart" ).button().click(function() { $.qsglobal.currcoord = $(this); setmap($( "#tasklocationstart" ).val(),$( "#tasklocationstart" ),false);});
                }
                if($( "#tasklocationend" ).val() == "") {
                    $( "#tasklocationend" ).button().click(function() { $.qsglobal.currcoord = $(this); setmap('0,0',$( "#tasklocationend" ),true);});
                } else {
                    $( "#tasklocationend" ).button().click(function() { $.qsglobal.currcoord = $(this); setmap($( "#tasklocationend" ).val(),$( "#tasklocationend" ),false);});
                }
                
                $( "#taskactivechoice" ).buttonset();
                $( "#taskweekday" ).buttonset();
                $("#taskcolor").simpleColor({
			border: '1px solid #333333',
			boxHeight: '25px',
			displayColorCode: true
                });
                $( "#taskactive" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#tasksunday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#taskmonday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#tasktuesday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#taskwednesday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#taskthursday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#taskfriday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                $( "#tasksaturday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                    
                var name = $( "#taskname" ),
                    description = $( "#taskdescription" ),
                    color = $( "#taskcolor" ),
                    type = $( "#tasktype" ),
                    locationstart = $( "#tasklocationstart" ),
                    locationend = $( "#tasklocationend" ),
                    starttime = $( "#taskstarttime" ),
                    duration = $( "#taskduration" ),
                    minworkduration = $( "#taskminworkduration" ),
                    maxworkduration = $( "#taskmaxworkduration" ),
                    qty = $( "#taskqty" ),
                    sunday = $( "#tasksunday" ),
                    monday = $( "#taskmonday" ),
                    tuesday = $( "#tasktuesday" ),
                    wednesday = $( "#taskwednesday" ),
                    thursday = $( "#taskthursday" ),
                    friday = $( "#taskfriday" ),
                    saturday = $( "#tasksaturday" ),
                    active = $( "#taskactive" ),
                    allFields = $( [] ).add( name ).add( description ).add( color ).add( type ).add( locationstart ).add( locationend )
                        .add( starttime ).add( duration ).add( minworkduration ).add( maxworkduration ).add( qty )
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
                            
                            var taskinfo = {
                                token:$.qsglobal.session_token, 
                                name:name.val(),
                                description:description.val(),
                                color:color.val(),
                                type:type.val(),
                                locationstart:locationstart.val(),
                                locationend:locationend.val(),
                                starttime:starttime.val(),
                                duration:duration.val(),
                                minworkduration:minworkduration.val(),
                                maxworkduration:maxworkduration.val(),
                                qty:qty.val(),
                                sunday:sunday.val(),
                                monday:monday.val(),
                                tuesday:tuesday.val(),
                                wednesday:wednesday.val(),
                                thursday:thursday.val(),
                                friday:friday.val(),
                                saturday:saturday.val(),
                                active:active.val(),
                                note:"==="+name+"===",
                                id:-1
                            };
                            if(o.ind==-1) {
                                taskinfo.id = -1;
                                postjson($.qsglobal.dbaddr+'addtasks', taskinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        taskinfo.id = data.id;
                                        $.qsglobal.tasks.push(taskinfo);
                                        if(!$.qsglobal.isfullscreen) {
                                            $("#tasks").tasksScreen({loff: 83, toff: 101});
                                        } else {
                                            $("#fullscreen").tasksScreen();
                                        }
                                    } else {
                                        alert("Save failed.")
                                    }
                                }, false, null);
                            } else {
                                taskinfo.id = o.item.id;
                                taskinfo.note = o.item.note;
                                postjson($.qsglobal.dbaddr+'updatetasks', taskinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        taskinfo.id = o.item.id;
                                        $.qsglobal.tasks.splice(o.ind,1,taskinfo);
                                        if(!$.qsglobal.isfullscreen) {
                                            $("#tasks").tasksScreen({loff: 83, toff: 101});
                                        } else {
                                            $("#fullscreen").tasksScreen();
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
        demandEditScreen: function(opts) {          
            $( this ).empty();
            
            //Settings list and the default values
            var defaults = {
                ind: -1,
                tind: -1,
                item: null,
                titem: null
            };
            var options = $.extend(defaults, opts);
         
            return this.each(function() {
                var o =options;
                var obj = $(this);
                
                if(o.ind == -1) {
                    o.item = {}
                    o.item.starttime = "";
                    o.item.duration = "";
                    o.item.quantity = "";
                    o.item.timeneeded = "";
                    o.item.token = $.qsglobal.session_token;
                }
                
                var type_log = $('<div id="demand-edit"><div>').appendTo( obj );
                type_log.append($('<p class="validateTips">Fill the required fields</p>'));
                type_log.append($('<form></form>').html(
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="demandstarttime">Start time</label>'+
                    '<input type="text" id="demandstarttime" value="'+o.item.starttime+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="demandduration">Duration</label>'+
                    '<input type="text" id="demandduration" value="'+o.item.duration+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="demandquantity">Quantity</label>'+
                    '<input type="text" id="demandquantity" value="'+o.item.quantity+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="demandtimeneeded">Time needed</label>'+
                    '<input type="text" id="demandtimeneeded" value="'+o.item.timeneeded+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '</fieldset>'));
                        
                var starttime = $( "#demandstarttime" ),
                    duration = $( "#demandduration" ),
                    quantity = $( "#demandquantity" ),
                    timeneeded = $( "#demandtimeneeded" ),
                    allFields = $( [] ).add( starttime ).add( duration ).add( quantity ).add( timeneeded ),
                    tips = $( ".validateTips" );
                 
                obj.dialog({
		    autoOpen: false,
		    width: 750,
		    modal: true,
		    buttons: {
                        "Save": function() {
                            var bValid = true;
                            
                            allFields.removeClass( "ui-state-error" );
                            
                            var demandinfo = {
                                token:$.qsglobal.session_token,
                                starttime:starttime.val(),
                                duration:duration.val(),
                                quantity:quantity.val(),
                                timeneeded:timeneeded.val(),
                                taskid:o.titem.id,
                                id:""
                            };
                            if(o.ind==-1) {
                                demandinfo.id = -1;
                                postjson($.qsglobal.dbaddr+'adddemands', demandinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        demandinfo.id = data.id;
                                        $.qsglobal.demands.push(demandinfo);
                                        $("#task-form").taskEditScreen({ind:o.tind, item:o.titem} );
                                    } else {
                                        alert("Save failed.")
                                    }
                                }, false, null);
                            } else {
                                demandinfo.id = o.item.id;
                                postjson($.qsglobal.dbaddr+'updatedemands', demandinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        demandinfo.id = o.item.id;
                                        $.qsglobal.demands.splice(o.ind,1,demandinfo);
                                        $("#task-form").taskEditScreen({ind:o.tind, item:o.titem} );
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
        taskresEditScreen: function(opts) {          
            $( this ).empty();
            
            //Settings list and the default values
            var defaults = {
                item: null,
                ind: -1,
                blockobj: null,
            };
            
            var options = $.extend(defaults, opts);
         
            return this.each(function() {
                var o =options;
                var obj = $(this);
                alert(o.ind+' '+o.item.qty);
                var inqty = '',
                    instarttime = '',
                    induration = '';
                if(o.ind != -1) {
                   inqty = o.item.qty;
                   instarttime = o.item.starttime;
                   induration = o.item.duration;
                }
                var type_log = $('<div id="taskres-edit"><div>').appendTo( obj );
                type_log.append($('<p class="validateTips">Fill the required fields</p>'));
                type_log.append($('<form></form>').html(
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 45%; height: 25px;" for="taskresqty">Resource qty requirement</label>'+
                    '<input type="text" id="taskresqty" value="'+inqty+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:50%"/><br/>'+
                    '<label style="display: inline-block; width: 45%; height: 25px;" for="taskresstarttime">Resource utilization start time</label>'+
                    '<input type="text" id="taskresstarttime" value="'+instarttime+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:50%"/><br/>'+
                    '<label style="display: inline-block; width: 45%; height: 25px;" for="taskresduration">Resource utilization duration</label>'+
                    '<input type="text" id="taskresduration" value="'+induration+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:50%;"/><br />'+ 
                    '</fieldset>'));
                
                var qty = $( "#taskresqty" ),
                    starttime = $( "#taskresstarttime" ),
                    duration = $( "#taskresduration" ),
                    allFields = $( [] ).add( qty ).add( starttime ).add( duration ),
                    tips = $( ".validateTips" );
                 
                obj.dialog({
		    autoOpen: false,
		    width: 750,
		    modal: true,
		    buttons: {
                        "Save": function() {
                            var bValid = true;
                            
                            allFields.removeClass( "ui-state-error" );
                            
                            var taskresinfo = {
                                token:$.qsglobal.session_token, 
                                qty:qty.val(),
                                starttime:starttime.val(),
                                duration:duration.val(),
                                type:o.item.type,
                                id1:o.item.id1,
                                id2:o.item.id2
                            };
                            
                            taskresinfo.id = o.item.id;
                            postjson($.qsglobal.dbaddr+'updatemaps', taskresinfo, function(data) {
                                if(data.success == "true")
                                {
                                    taskresinfo.id = o.item.id;
                                    $.qsglobal.maps.splice(o.ind,1,taskresinfo);
                                    
                                } else {
                                    alert("Save failed.")
                                }
                            }, false, null);
                            
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