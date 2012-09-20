/*
 * QuickSchedule Tags jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://skdit.com
 *
 */

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        tagsScreen: function(opts) {
            
            var defaults = {
                loff: 0,
                toff: 0
            };
            
            var options = $.extend(defaults, opts);
            
            return this.each(function() {
                var obj = $(this);
                $(this).empty();
                var bbar = $("<div id=\"tagbar\"></div>").appendTo($(this));
                bbar.css('width',$(window).width()-options.loff-20);
                
                $("<span id=\"tagradioassign\"></span>").html(
                    "<input type=\"radio\" id=\"tagradioedit\" checked=\"checked\" name=\"tagradioassign\"/><label for=\"tagradioedit\">"+tr("Edit")+"</label>"+
                    "<input type=\"radio\" id=\"tagradioworker\" name=\"tagradioassign\"/><label for=\"tagradioworker\">"+tr("Workers")+"</label>"+
                    "<input type=\"radio\" id=\"tagradiotask\" name=\"tagradioassign\"/><label for=\"tagradiotask\">"+tr("Tasks")+"</label>"+
                    "<input type=\"radio\" id=\"tagradioshift\" name=\"tagradioassign\"/><label for=\"tagradioshift\">"+tr("Shifts")+"</label>"+
                    "<input type=\"radio\" id=\"tagradioresource\" name=\"tagradioassign\"/><label for=\"tagradioresource\">"+tr("Resources")+"</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                $( "#tagradioedit" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currtaglist" ).show();
                });
                $( "#tagradioworker" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currtaglist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 3,
                        pos: 2,
                        loff: options.loff,
                        toff: options.toff+67,
                        upobj: $.qsglobal.tags,
                        upblockclass: 'tblock',
                        uptextclass: 'tblocktext',
                        downname: function(val) {return val.firstname+' '+val.lastname;},
                        downdesc: function(val) {return val.code;},
                        downimg: true,
                        downobj: $.qsglobal.workers,
                        downblockclass: 'wblock',
                        downtextclass: 'wblocktext',
                    });
                });
                $( "#tagradiotask" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currtaglist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 5,
                        pos: 2,
                        loff: options.loff,
                        toff: options.toff+67,
                        upobj: $.qsglobal.tags,
                        upblockclass: 'tblock',
                        uptextclass: 'tblocktext',
                        downobj: $.qsglobal.tasks,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                $( "#tagradioshift" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currtaglist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 6,
                        pos: 2,
                        loff: options.loff,
                        toff: options.toff+67,
                        upobj: $.qsglobal.tags,
                        upblockclass: 'tblock',
                        uptextclass: 'tblocktext',
                        downobj: $.qsglobal.shifts,
                        downblockclass: 'tblock',
                        downtextclass: 'tblocktext',
                    });
                });
                $( "#tagradioresource" ).button().click(function() {
                    $( "#currvmap" ).remove();
                    $( "#currtaglist" ).hide();
                    var newwin = $( "<div id=\"currvmap\"></div>" ).appendTo(obj);
                    newwin.vMap({
                        type: 7,
                        pos: 2,
                        loff: options.loff,
                        toff: options.toff+67,
                        upobj: $.qsglobal.tags,
                        upblockclass: 'tblock',
                        uptextclass: 'tblocktext',
                        downdesc: function(val) {return val.description+' ('+val.capacity+')';},
                        downobj: $.qsglobal.resources,
                        downblockclass: 'rblock',
                        downtextclass: 'rblocktext',
                    });
                });
                $( "<span><button id=\"tagfullscreen\">Fullscreen</button></span>").css('float','right').appendTo(bbar).css('height', '32').css('background', '#a0b4d2')
                    .button({text: false, icons: {primary: "ui-icon-arrowthick-2-ne-sw"}}).click(function() {
                        if(!$.qsglobal.isfullscreen) {
                            $.qsglobal.isfullscreen = true;
                            $("#tags").empty();
                            $( "#appmain" ).hide();
                            $("#fullscreen").show();
                            $( "#fullscreen" ).width($(window).width());
                            $( "#fullscreen" ).height($(window).height());
                            $("#fullscreen").tagsScreen({loff: 0, toff: 0});
                            
                        } else {
                            $.qsglobal.isfullscreen = false;
                            $("#fullscreen").empty();
                            $("#fullscreen").hide();
                            $( "#appmain" ).show();
                            $("#tags").tagsScreen({loff: 83, toff: 101});
                        }
                    });
                $( "<span><button id=\"tagtrash\">Delete</button></span>").css('float','right').appendTo(bbar).css('height', '32')
                    .css('background', '#a0b4d2').button({text: false, icons: {primary: "ui-icon-trash"}}).click(function() {
                        rem=[];
                        $( ".ui-selected", ".taglist" ).each(function() {
                            var ind = $("#currtaglist li").index(this)-1;
                            rem.push(ind);
                            var sub=0;
                            $.each(rem, function(key,val) {
                                if(val<ind) {
                                    sub++;
                                }
                            });
                            ind=ind-sub;
                            
                            var taginfo = {token:$.qsglobal.session_token, id:$( this ).attr( "tagid" )};
                            postjson($.qsglobal.dbaddr+'deltags', taginfo, function(data) {
                                if(data.success == "true") {
                                    $.qsglobal.tags.splice(ind,1);
                                } else {
                                    alert(tr("Failed to delete"));
                                }
                            }, false, null);
			});
                        if(!$.qsglobal.isfullscreen) {
                            $("#normalscreen").tagsScreen({loff: 83, toff: 101});
                        } else {
                            $("#fullscreen").tagsScreen();
                        }
                    });
                
                var ulist = $('<ul class="taglist" id="currtaglist"></ul>').appendTo( $( this ) );
            
                if($.qsglobal.tags != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="tblocktext">'+tr("Add a new tag")+'</div>').addClass("tblock")
                        .click( function() { $( "#tag-form" ).attr("title", tr("New tag")).tagEditScreen().dialog( "open" );}).addClass("taddblock").attr("tagid", -1);
                    ulist.append(temp);
                    $.each($.qsglobal.tags, function(key,val) {
                        
                        temp = $( "<li></li>" ).html('<div class="tcolorblock" style="background:'+val.color+'"></div><div class="tblocktext"><h3>'+val.name+'</h3>'
                            +val.description+'</div>').addClass("tblock").attr("tagid", val.id)
                            .dblclick( function() { $( "#tag-form" ).tagEditScreen({ind: key, item: val}).dialog( "open" );});
                        ulist.append(temp);
                    });
                }
                
                ulist.selectable({ filter: "li", cancel: ".ui-selected, .taddblock" });
                
            });
        },
        tagEditScreen: function(opts) {          
            $( this ).empty();
            //Settings list and the default values
            var defaults = {
                ind: -1,
                item: null
            };
            $( this ).empty();
            var o = $.extend(defaults, opts);
            o.reload = function () { showtags(); };
            o.savefunction = function(o) {savetodb({jsonadd: "addtags", jsonupdate: "updatetags", globalobj: $.qsglobal.tags}, o);};
            o.tr = tr;
            o.prefix="tagedit-";
            o.idname = "tag-edit";
            o.fields = [
                {name: "Color", itemname: "color", type: "color", defval: "#cc3333", col: 1},
                {name: "Tag", itemname: "name", type: "text", defval: "", col: 1},
                {name: "Description", itemname: "description", type: "time", defval: "", col: 1}
            ];
            return this.each(function() {
                $(this).qsforms(o);
            });
        }
    });
})(jQuery);

function gettagsdata(done) {
    $.qsglobal.tags = null;
    var taginfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'gettags', taginfo, function(data) {
        if(data != null)
            $.qsglobal.tags = data.slice();
    }, true, done);
}