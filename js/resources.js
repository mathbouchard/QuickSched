/*
 * QuickSchedule Resources jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://skdit.com
 *
 */

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        resourcesScreen: function(opts) {
            
            var defaults = {
                loff: 0,
                toff: 0
            };
            
            var options = $.extend(defaults, opts);
            
            return this.each(function() {
                $(this).empty();
                obj = $(this);
                var bbar = $("<div id=\"resbar\"></div>").appendTo($(this));
                bbar.css('width',$(window).width()-options.loff-20);
                
                $("<span id=\"resradioassign\"></span>").html(
                    "<input type=\"radio\" id=\"resradioedit\" checked=\"checked\" name=\"resradioassign\"/><label for=\"resradioedit\">"+tr("Edit")+"</label>"+
                    "<input type=\"radio\" id=\"resradiotag\" name=\"resradioassign\"/><label for=\"resradiotag\">"+tr("Tags")+"</label>"+
                    "<input type=\"radio\" id=\"resradioworker\" name=\"resradioassign\"/><label for=\"resradioworker\">"+tr("Workers")+"</label>"+
                    "<input type=\"radio\" id=\"resradiotask\" name=\"resradioassign\"/><label for=\"resradiotask\">"+tr("Tasks")+"</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                
                $( "#resradioedit" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currreslist" ).show();
                });
                $( "#resradiotag" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currreslist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 7,
                        pos: 1,
                        loff: options.loff,
                        toff: options.toff+67,
                        updesc: function(val) {return val.desc+' ('+val.capacity+')';},
                        upobj: $.qsglobal.resources,
                        upblockclass: 'rblock',
                        uptextclass: 'rblocktext',
                        downobj: $.qsglobal.tags,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                $( "#resradioworker" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currreslist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 2,
                        pos: 2,
                        loff: options.loff,
                        toff: options.toff+67,
                        updesc: function(val) {return val.desc+' ('+val.capacity+')';},
                        upobj: $.qsglobal.resources,
                        upblockclass: 'rblock',
                        uptextclass: 'rblocktext',
                        downname: function(val) {return val.firstname+' '+val.lastname;},
                        downdesc: function(val) {return val.code;},
                        downobj: $.qsglobal.workers,
                        downimg: true,
                        downblockclass: 'wblock',
                        downtextclass: 'wblocktext',
                    });
                });
                $( "#resradiotask" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currreslist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 4,
                        pos: 2,
                        loff: options.loff,
                        toff: options.toff+67,
                        updesc: function(val) {return val.desc+' ('+val.capacity+')';},
                        upobj: $.qsglobal.resources,
                        upblockclass: 'rblock',
                        uptextclass: 'rblocktext',
                        downobj: $.qsglobal.tasks,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                
                $( "<span><button id=\"resfullscreen\">Fullscreen</button></span>").css('float','right').appendTo(bbar).css('height', '32').css('background', '#a0b4d2')
                    .button({text: false, icons: {primary: "ui-icon-arrowthick-2-ne-sw"}}).click(function() {
                        if(!$.qsglobal.isfullscreen) {
                            $.qsglobal.isfullscreen = true;
                            $("#resources").empty();
                            $( "#appmain" ).hide();
                            $("#fullscreen").show();
                            $( "#fullscreen" ).width($(window).width());
                            $( "#fullscreen" ).height($(window).height());
                            $("#fullscreen").resourcesScreen({loff: 0, toff: 0});
                            
                        } else {
                            $.qsglobal.isfullscreen = false;
                            $("#fullscreen").empty();
                            $("#fullscreen").hide();
                            $( "#appmain" ).show();
                            $("#resources").resourcesScreen({loff: 83, toff: 101});
                        }
                    });
                $( "<span><button id=\"restrash\">Delete</button></span>").css('float','right').appendTo(bbar).css('height', '32')
                    .css('background', '#a0b4d2').button({text: false, icons: {primary: "ui-icon-trash"}}).click(function() {
                        rem=[];
                        $( ".ui-selected", ".reslist" ).each(function() {
                            var ind = $("#currreslist li").index(this)-1;
                            rem.push(ind);
                            var sub=0;
                            $.each(rem, function(key,val) {
                                if(val<ind) {
                                    sub++;
                                }
                            });
                            ind=ind-sub;
                            
                            var resinfo = {token:$.qsglobal.session_token, id:$( this ).attr( "resourceid" )};
                            postjson($.qsglobal.dbaddr+'delresources', resinfo, function(data) {
                                if(data.success == "true") {
                                    $.qsglobal.resources.splice(ind,1);
                                } else {
                                    alert(tr("Failed to delete"));
                                }
                            }, false, null);
			});
                        if(!$.qsglobal.isfullscreen) {
                            $("#normalscreen").resourcesScreen({loff: 83, toff: 101});
                        } else {
                            $("#fullscreen").resourcesScreen();
                        }
                    });
                
                var ulist = $('<ul class="reslist" id="currreslist"></ul>').appendTo( $( this ) );
            
                if($.qsglobal.resources != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="rblocktext">'+tr("Add a new resource")+'</div>').addClass("rblock")
                        .click( function() { $( "#resource-form" ).attr("title", tr("New resource")).resourceEditScreen().dialog( "open" );}).addClass("raddblock").attr("resourceid", -1);
                    ulist.append(temp);
                    $.each($.qsglobal.resources, function(key,val) {
                        
                        temp = $( "<li></li>" ).html('<div class="rcolorblock" style="background:'+val.color+'"></div><div class="rblocktext"><h3>'+val.name+'</h3>'
                            +val.description+' ('+val.capacity+')</div>').addClass("rblock").attr("resourceid", val.id)
                            .dblclick( function() { $( "#resource-form" ).resourceEditScreen({ind: key, item: val}).dialog( "open" );});
                        ulist.append(temp);
                    });
                }
                
                ulist.selectable({ filter: "li", cancel: ".ui-selected, .raddblock" });
            });
        },
        resourceEditScreen: function(opts) {          
            $( this ).empty();
            var defaults = {
                ind: -1,
                item: null
            };
            $( this ).empty();
            var o = $.extend(defaults, opts);
            o.reload = function () { showresources(); };
            o.savefunction = function(o) {savetodb({jsonadd: "addresources", jsonupdate: "updateresources", globalobj: $.qsglobal.resources}, o);};
            o.tr = tr
            o.prefix="redit-";;
            o.idname = "resource-edit";
            o.fields = [
                {name: "Color", itemname: "color", type: "color", defval: "#cc3333", col: 1},
                {name: "Resource", itemname: "name", type: "text", defval: "", col: 1},
                {name: "Description", itemname: "description", type: "time", defval: "", col: 1},
                {name: "Capacity", itemname: "capacity", type: "numeric", defval: "", col: 1}
            ];
            return this.each(function() {
                $(this).qsforms(o);
            });
        }
    });
})(jQuery);

function getresourcesdata(done) {
    $.qsglobal.resources = null;
    var resinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getresources', resinfo, function(data) {
        if(data != null)
            $.qsglobal.resources = data.slice();
    }, true, done);
}