/*
 * QuickSchedule Resources jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
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
                    "<input type=\"radio\" id=\"resradioedit\" checked=\"checked\" name=\"resradioassign\"/><label for=\"resradioedit\">Edit</label>"+
                    "<input type=\"radio\" id=\"resradiotag\" name=\"resradioassign\"/><label for=\"resradiotag\">Tags</label>"+
                    "<input type=\"radio\" id=\"resradioworker\" name=\"resradioassign\"/><label for=\"resradioworker\">Workers</label>"+
                    "<input type=\"radio\" id=\"resradiotask\" name=\"resradioassign\"/><label for=\"resradiotask\">Tasks</label>")
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
                                    alert("Delete failed.");
                                }
                            }, false, null);
			});
                        if(!$.qsglobal.isfullscreen) {
                            $("#resources").resourcesScreen({loff: 83, toff: 101});
                        } else {
                            $("#fullscreen").resourcesScreen();
                        }
                    });
                
                var ulist = $('<ul class="reslist" id="currreslist"></ul>').appendTo( $( this ) );
            
                if($.qsglobal.resources != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="rblocktext">Add a new resource</div>').addClass("rblock")
                        .click( function() { $( "#resource-form" ).resourceEditScreen().dialog( "open" );}).addClass("raddblock").attr("resourceid", -1);
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
                    incolor = '#cc3333',
                    incapacity = '1';
                if(o.ind != -1) {
                   inname = o.item.name;
                   indesc = o.item.description;
                   incolor = o.item.color;
                   incapacity = o.item.capacity;
                }
                var type_log = $('<div id="resource-edit"><div>').appendTo( obj );
                type_log.append($('<p class="validateTips">Fill the required fields</p>'));
                type_log.append($('<form></form>').html(
                    '<fieldset>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="rescolor">Color</label>'+
                    '<input style="display: inline-block;" id="rescolor" value="'+incolor+'"><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="resname">Tag</label>'+
                    '<input type="text" id="resname" value="'+inname+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%"/><br/>'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="resdesc">Description</label>'+
                    '<input type="text" id="resdesc" value="'+indesc+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%;"/><br />'+
                    '<label style="display: inline-block; width: 15%; height: 25px;" for="rescapacity">Capacity</label>'+
                    '<input type="text" id="rescapacity" value="'+incapacity+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:80%;"/><br />'+
                    '</fieldset>'));
                
                $("#rescolor").simpleColor({
			border: '1px solid #333333',
			boxHeight: '25px',
			displayColorCode: true
                });
                
                var name = $( "#resname" ),
                    desc = $( "#resdesc" ),
                    color = $( "#rescolor" ),
                    capacity = $( "#rescapacity" ),
                    allFields = $( [] ).add( name ).add( desc ).add( color ).add( capacity ),
                    tips = $( ".validateTips" );
                 
                obj.dialog({
		    autoOpen: false,
		    width: 750,
		    modal: true,
		    buttons: {
                        "Save": function() {
                            var bValid = true;
                            
                            allFields.removeClass( "ui-state-error" );
                            
                            var resinfo = {token:$.qsglobal.session_token, name:"", description:"", color:"", capacity:"1", id:""};
                            resinfo.name = name.val();
                            resinfo.description = desc.val();
                            resinfo.color = color.val();
                            resinfo.capacity = capacity.val();
                            if(o.ind==-1) {
                                resinfo.id = -1;
                                postjson($.qsglobal.dbaddr+'addresources', resinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        resinfo.id = data.id;
                                        $.qsglobal.resources.push(resinfo);
                                        if(!$.qsglobal.isfullscreen) {
                                            $("#resources").resourcesScreen({loff: 83, toff: 101});
                                        } else {
                                            $("#fullscreen").resourcesScreen();
                                        }
                                    } else {
                                        alert("Save failed.")
                                    }
                                }, false, null);
                            } else {
                                resinfo.id = o.item.id;
                                postjson($.qsglobal.dbaddr+'updateresources', resinfo, function(data) {
                                    if(data.success == "true")
                                    {
                                        resinfo.id = o.item.id;
                                        $.qsglobal.resources.splice(o.ind,1,resinfo);
                                        if(!$.qsglobal.isfullscreen) {
                                            $("#resources").resourcesScreen({loff: 83, toff: 101});
                                        } else {
                                            $("#fullscreen").resourcesScreen();
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

function getresourcesdata(done) {
    $.qsglobal.resources = null;
    var resinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getresources', resinfo, function(data) {
        if(data != null)
            $.qsglobal.resources = data.slice();
    }, true, done);
}