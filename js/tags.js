/*
 * QuickSchedule Tags jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
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
                    "<input type=\"radio\" id=\"tagradioedit\" checked=\"checked\" name=\"tagradioassign\"/><label for=\"tagradioedit\">Edit</label>"+
                    "<input type=\"radio\" id=\"tagradioworker\" name=\"tagradioassign\"/><label for=\"tagradioworker\">Workers</label>"+
                    "<input type=\"radio\" id=\"tagradiotask\" name=\"tagradioassign\"/><label for=\"tagradiotask\">Tasks</label>"+
                    "<input type=\"radio\" id=\"tagradioshift\" name=\"tagradioassign\"/><label for=\"tagradioshift\">Shifts</label>"+
                    "<input type=\"radio\" id=\"tagradioresource\" name=\"tagradioassign\"/><label for=\"tagradioresource\">Resources</label>")
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
                                    alert("Delete failed.");
                                }
                            }, false, null);
			});
                        if(!$.qsglobal.isfullscreen) {
                            $("#tags").tagsScreen({loff: 83, toff: 101});
                        } else {
                            $("#fullscreen").tagsScreen();
                        }
                    });
                
                var ulist = $('<ul class="taglist" id="currtaglist"></ul>').appendTo( $( this ) );
            
                if($.qsglobal.tags != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="tblocktext">Add a new tag</div>').addClass("tblock")
                        .click( function() { $( "#tag-form" ).tagEditScreen().dialog( "open" );}).addClass("taddblock").attr("tagid", -1);
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
            var options = $.extend(defaults, opts);
         
            return this.each(function() {
                var o =options;
                var obj = $(this);
                //$(this).css('background', '#a0b4d2');
                
                
                var inname = '',
                    indesc = '',
                    incolor = '#cc3333';
                if(o.ind != -1) {
                   inname = o.item.name;
                   indesc = o.item.description;
                   incolor = o.item.color;
                }
                var type_log = $('<div id="tag-edit"><div>').appendTo( obj );
                type_log.append($('<p class="validateTips">Fill the required fields</p>'));
                type_log.append($('<form></form>').html(
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="tagcolor">Color</label>'+
                    '<input style="display: inline-block;" id="tagcolor" value="'+incolor+'"><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="tagname">Tag</label>'+
                    '<input type="text" id="tagname" value="'+inname+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="tagdesc">Description</label>'+
                    '<input type="text" id="tagdesc" value="'+indesc+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%;"/><br />'+
                    //'<input type="text" name="color" id="tagcolor" value="#cc3333" class="text ui-widget-content ui-corner-all" />'+
                    
                    '</fieldset>'));
                
                $("#tagcolor").simpleColor({
			border: '1px solid #333333',
			boxHeight: '25px',
			displayColorCode: true
                });
                
                var name = $( "#tagname" ),
                    desc = $( "#tagdesc" ),
                    color = $( "#tagcolor" ),
                    allFields = $( [] ).add( name ).add( desc ).add( color ),
                    tips = $( ".validateTips" );
                 
                obj.dialog({
		    autoOpen: false,
		    width: 750,
		    modal: true,
		    buttons: {
                        "Save": function() {
                            var bValid = true;
                            
                            allFields.removeClass( "ui-state-error" );
                            
                            var taginfo = {token:$.qsglobal.session_token, name:"", description:"", color:"", id:""};
                            taginfo.name = name.val();
                            taginfo.description = desc.val();
                            taginfo.color = color.val();
                            if(o.ind==-1) {
                                taginfo.id = -1;
                                postjson($.qsglobal.dbaddr+'addtags', taginfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        taginfo.id = data.id;
                                        $.qsglobal.tags.push(taginfo);
                                        if(!$.qsglobal.isfullscreen) {
                                            $("#tags").tagsScreen({loff: 83, toff: 101});
                                        } else {
                                            $("#fullscreen").tagsScreen();
                                        }
                                    } else {
                                        alert("Save failed.")
                                    }
                                }, false, null);
                            } else {
                                taginfo.id = o.item.id;
                                postjson($.qsglobal.dbaddr+'updatetags', taginfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        taginfo.id = o.item.id;
                                        $.qsglobal.tags.splice(o.ind,1,taginfo);
                                        if(!$.qsglobal.isfullscreen) {
                                            $("#tags").tagsScreen({loff: 83, toff: 101});
                                        } else {
                                            $("#fullscreen").tagsScreen();
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