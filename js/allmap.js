/*
 * QuickSchedule Mapping jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

(function($){
    $.fn.extend({ 
        vMap: function(opts) {     
            var defaults = {
                loff: 0,
                toff: 0,
                type: 7,
                pos: 1,
                upobj: null,
                upimg: false,
                upname: function(val) {return val.name;},
                updesc: function(val) {return val.description;},
                upblockclass: 'wblock',
                uptextclass: 'wblocktext',
                downobj: null,
                downimg: false,
                downname: function(val) {return val.name;},
                downdesc: function(val) {return val.description;},
                downblockclass: 'wblock',
                downtextclass: 'wblocktext',
            };
            
            var o = $.extend(defaults, opts);
            
            return this.each(function() {
                
                $(this).empty();
                var obj = $(this);
                
                var updiv = $("<div id=\"vmap-up\"></div>").css("overflow-y", "scroll").css("width", $(window).width()-o.loff).css("height", ($(window).height()-o.toff)/2.0)
                    .css("border", "solid").css("border-color", "#aaa").css("border-width", "0px 0px 1px 0px").appendTo( $(this) );
                var downdiv = $("<div id=\"vmap-down\"></div>").css("overflow-y", "scroll").css("width", $(window).width()-o.loff).css("height", ($(window).height()-o.toff)/2).appendTo( $(this) );
				
                var uplist = $('<ul id="uplist"></ul>').appendTo( updiv );
                var downlist = $('<ul id="downlist"></ul>').appendTo( downdiv );
         
                if(o.upobj != null)
                {
                    $.each(o.upobj, function(key,val) {
                        var imgpart = "";
                        if(o.upimg) {
                            var imglink = "img/someone_wb.png";
                            if(val.picturelink != null && val.picturelink != "") {
                                imglink = val.picturelink;  
                            }
                            imgpart = '<img src="'+imglink+'"></img>';
                        }
                        temp = $( "<li></li>" ).html('<div class="tcolorblock" style="background:'+val.color+'">'+imgpart
                            +'</div><div class="'+o.uptextclass+'"><h3>'+o.upname(val)+'</h3>'+o.updesc(val)+'</div>').addClass(o.upblockclass).dblclick(function() {
                                $('<div id="individualmapping"></div>').appendTo(obj).hMap({
                                    type: o.type,
                                    pos: o.pos,
                                    obj: o.downobj,
                                    subobj: $.qsglobal.maps,
                                    img: o.downimg,
                                    id: val.id,
                                    blockclass: o.downblockclass,
                                    textclass: o.downtextclass,
                                    name: o.downname,
                                    desc: o.downdesc,
                                }).dialog("option", "title", o.upname(val)+' mapping').dialog("open");
                            }).attr("objid", val.id);
			
                        uplist.append(temp);
                    });
                }
                
                if(o.downobj != null)
                {
                    $.each(o.downobj, function(key,val) {
                        var imgpart = "";
                        if(o.downimg) {
                            var imglink = "img/someone_wb.png";
                            if(val.picturelink != null && val.picturelink != "") {
                                imglink = val.picturelink;  
                            }
                            imgpart = '<img src="'+imglink+'"></img>';
                        }
                        temp = $( "<li></li>" ).html('<div class="tcolorblock" style="background:'+val.color+'">'+imgpart
                            +'</div><div class="'+o.downtextclass+'"><h3>'+o.downname(val)+'</h3>'+o.downdesc(val)+'</div>').addClass(o.downblockclass).attr("objid", val.id);
                        
                        downlist.append(temp);
                    });
                }
                
                $("#uplist li").draggable({
                    appendTo: "body",
                    helper: "clone"
                });
                $( "#downlist li" ).droppable({
                    activeClass: "vmap-active",
                    hoverClass: "vmap-hover",
                    //accept: ":not(.waddblock)",
                    drop: function( event, ui ) {
                        var mapinfo = {};
                        if(o.pos == 1) {
                            mapinfo = {token:$.qsglobal.session_token, id2: $( this ).attr("objid"), id1: ui.draggable.attr("objid"),
                                type: o.type, qty: 1, starttime: "0:00", duration: "0:00"};
                        } else {
                            mapinfo = {token:$.qsglobal.session_token, id1: $( this ).attr("objid"), id2: ui.draggable.attr("objid"), 
                                type: o.type, qty: 1, starttime: "0:00", duration: "0:00"};
                        }
                        postjson($.qsglobal.dbaddr+'addmaps', mapinfo, function(data) {
                            if(data.success == "true")
                            {
                                $.qsglobal.maps.push(mapinfo);
                            } else {
                                alert("Redundant map.")
                            }
                        }, true, null);
                    }
                });
            });
        },
        hMap: function(opts) {     
            var defaults = {
                obj: null,
                subobj: null,
                type: 7,
                pos: 1,
                id: -1,
                img: false,
                name: function(val) {return val.name;},
                desc: function(val) {return val.description;},
                blockclass: 'wblock',
                textclass: 'wblocktext',
            };
            
            var o = $.extend(defaults, opts);
            
            return this.each(function() {
                
                $(this).empty();
                obj = $(this);
                $(this).css("padding", 0).css("margin", 0);
                //var mapcont = $('<div></div>').css("width", "100%").css("height", "100%").css("overflow","scroll").appendTo(obj);
                
                var ldiv = $("<div id=\"hmap-left\"><h3 style=\"text-align: center\">Mapped</h3></div>").css("width", "50%").css("height", "100%")
                    .css("float","left").css("overflow","scroll").css("border", "solid").css("border-color", "#aaa").css("border-width", "0px 1px 0px 0px").appendTo( obj );
                var rdiv = $("<div id=\"hmap-right\"><h3 style=\"text-align: center\">Not mapped</h3></div>").css("width", "49%").css("float","left")
                    .css("height", "100%").css("overflow","scroll").appendTo( obj );
				
                var llist = $('<ul id="llist"></ul>').appendTo( ldiv );
                var rlist = $('<ul id="rlist"></ul>').appendTo( rdiv );
                
                var objmap = {};
                var corrmap = {};
                setmapid(o,o.subobj);
         
                var subid = [];
                if(o.subobj != null) {
                    $.each(o.subobj, function(key,val) {
                        if(o.pos == 1) {
                            if(val.type == o.type && val.id1 == o.id) {
                                subid.push(val.id2);
                            }
                        } else {
                            if(val.type == o.type && val.id2 == o.id) {
                                subid.push(val.id1);
                            }
                        }
                    });
                }
                if(o.obj != null) {
                    $.each(o.obj, function(key,val) {
                        corrmap[val.id] = key;
                    });
                }
         
                $.each(subid, function(key,val) {
                    objmap[val] = true;
                    var item = o.obj[corrmap[val]];
                    var imgpart = "";
                    if(o.img) {
                        var imglink = "img/someone_wb.png";
                        if(item.picturelink != null) {
                            imglink = item.picturelink;  
                        }
                        imgpart = '<img src="'+imglink+'"></img>';
                    }
                    temp = $( "<li></li>" ).html('<div class="tcolorblock" style="background:'+item.color+'">'+imgpart
                        +'</div><div class="'+o.textclass+'"><h3>'+o.name(item)+'</h3>'+o.desc(item)+'</div>').addClass(o.blockclass).attr("objid", item.id)
                        .addClass("lmapobj");
                    if(o.type==4)
                        temp.dblclick(function() {$("#taskres-form").taskresEditScreen({item: o.subobj[$.qsglobal.mapid[item.id]], ind: $.qsglobal.mapid[item.id]})
                            .dialog("open");});
                    
                    llist.append(temp);
                });
                
                if(o.obj != null)
                {
                    $.each(o.obj, function(key,val) {
                        var imgpart = "";
                        if(objmap[val.id] != true) {
                            if(o.img) {
                                var imglink = "img/someone_wb.png";
                                if(val.picturelink != null && val.picturelink != "") {
                                    imglink = val.picturelink;  
                                }
                                imgpart = '<img src="'+imglink+'"></img>';
                            }
                            temp = $( "<li></li>" ).html('<div class="tcolorblock" style="background:'+val.color+'">'+imgpart
                                +'</div><div class="'+o.textclass+'"><h3>'+o.name(val)+'</h3>'+o.desc(val)+'</div>').addClass(o.blockclass).attr("objid", val.id)
                                .addClass("rmapobj");
                            
                            rlist.append(temp);
                        }
                    });
                }
                var torem = null;
                var toadd = null;
                
                makedragdrop(o,torem,toadd);
                
                obj.dialog({
		    autoOpen: false,
		    height: 700,
		    width: 950,
		    modal: true,
                    close: function() {
                        
                    }
		});
            });
        }
    });
})(jQuery);

function makedragdrop(o, torem, toadd) {
    $("#rlist li").draggable({
        helper: function() {
            torem = $(this);
            toadd = $( "<li></li>" ).html($(this).html()).addClass(o.blockclass).attr("objid", $(this).attr("objid"))
                    .addClass("rmapobj");
            return toadd;
        },
        opacity: 0.7,
    });
    $( "#hmap-right" ).droppable({
        accept: ":not(.rmapobj)",
        activeClass: "vmap-active",
        drop: function( event, ui ) {
            var temp = $( "<li></li>" ).html(toadd.html()).addClass(o.blockclass).attr("objid", toadd.attr("objid"))
                    .addClass("rmapobj");
            $("#rlist").append(temp);
            
            torem.remove();
            
            var mapinfo = {token:$.qsglobal.session_token, id1: toadd.attr("objid"), id2: o.id, type: o.type, qty: 1};
            if(o.pos==1) {
                mapinfo.id1 = o.id;
                mapinfo.id2 = toadd.attr("objid");
            }
            postjson($.qsglobal.dbaddr+'delmaps', mapinfo, function(data) {
                if(data.success == "true")
                {
                    o.subobj.splice($.qsglobal.mapid[toadd.attr("objid")],1);
                    setmapid(o, o.subobj);
                } else {
                    alert("Delete failed.")
                }
            }, true, null);
            
            makedragdrop(o, torem, toadd);
        }
    });
    
    $("#llist li").draggable({
        helper: function() {
            torem = $(this);
            toadd = $( "<li></li>" ).html($(this).html()).addClass(o.blockclass).attr("objid", $(this).attr("objid"))
                    .addClass("lmapobj");
            return toadd;
        },
        opacity: 0.7,
    });
    $( "#hmap-left" ).droppable({
        accept: ":not(.lmapobj)",
        activeClass: "vmap-active",
        drop: function( event, ui ) {
            var temp = $( "<li></li>" ).html(toadd.html()).addClass(o.blockclass).attr("objid", toadd.attr("objid"))
                    .addClass("lmapobj");
            $("#llist").append(temp);
            if(o.type==4)
                temp.dblclick(function() {$("#taskres-form").taskresEditScreen({item: o.subobj[$.qsglobal.mapid[temp.attr("objid")]], ind: $.qsglobal.mapid[temp.attr("objid")]})
                    .dialog("open");});
            torem.remove();
            
            var mapinfo = {token:$.qsglobal.session_token, id1: toadd.attr("objid"), id2: o.id, type: o.type, qty: 1};
            if(o.pos==1) {
                mapinfo.id1 = o.id;
                mapinfo.id2 = toadd.attr("objid");
            }
            postjson($.qsglobal.dbaddr+'addmaps', mapinfo, function(data) {
                if(data.success == "true")
                {
                    o.subobj.push(mapinfo);
                    setmapid(o,o.subobj);
                } else {
                    alert("Delete failed.")
                }
            }, true, null);
            
            makedragdrop(o, torem, toadd);
            //toadd.remove();
        }
    });
}

function setmapid(o,obj) {
    $.qsglobal.mapid = {};
    if(obj != null) {
        $.each(obj, function(key,val) {
            if(val.type == o.type) {
                if(o.pos == 1) {
                    $.qsglobal.mapid[val.id2] = key;
                } else {
                    $.qsglobal.mapid[val.id1] = key;
                }
            }
        });
    }
}