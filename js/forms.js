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
        qsforms: function(opts) {          
            $( this ).empty();
            
            //Settings list and the default values
            var defaults = {
                ind: -1,
                savebutton: "Save",
                cancelbutton: "Cancel",
                tr: function(val) {return val},
                savefunction: function(o) {},
                cancelfunction: function(o) {}, 
                reload: null,
                item: null,
                multipletypes: false,
                idname: "from",
                fields: [],
                width: 15,
                prefix: "",
                bottomopts: null,
                hiddenval: []
            };
            
            var o = $.extend(defaults, opts);
            o.choiceval = {};
            var pre = o.prefix;
            return this.each(function() {
                var obj = $(this);
                var type_log = $('<div id="'+o.idname+'" class="automatic-form"><div>').appendTo( obj );
                var tdiv = $("<div id=\"ge-top\"></div>").css("width", "100%").css("height", "45px").css("padding", 0).css("margin", 0)
                    .css("float","left").appendTo( type_log );
                tdiv.append($('<p class="validateTips">'+tr("Fill the required fields")+'</p>').css("margin", 10));
                
                var allFields = $( [] );
                
                var doublecol = false;
                var htmlcont1 = '<fieldset>';
                var htmlcont2 = '<fieldset>';
                for(i = 0; i < o.fields.length; i++) {
                    if(o.fields[i].col == 1) {
                        htmlcont1 += elem2str(o,i);
                    } else {
                        htmlcont2 += elem2str(o,i);
                        doublecol = true;
                    }
                }
                htmlcont1 += '</fieldset>';
                htmlcont2 += '</fieldset>';
                if(doublecol) {
                    $("<div id=\"ge-left\"></div>").css("width", "48%").css("height", "100%").css("padding", "0 10px 0 10px").css("margin", 0)
                    .css("float","left").css("border", "solid").css("border-color", "#aaa").css("border-width", "0px 0px 0px 0px").appendTo( type_log )
                    .append($('<form></form>').html(htmlcont1));
                    $("<div id=\"ge-right\"></div>").css("width", "48%").css("float","left")
                    .css("height", "100%").appendTo( type_log ).append($('<form></form>').html(htmlcont2));
                } else {
                    $("<div id=\"ge-all\"></div>").css("width", "99%").css("height", "100%").css("padding", "0 10px 0 10px").css("margin", 0)
                    .css("float","left").appendTo( type_log ).append($('<form></form>').html(htmlcont1));
                }
                if(o.bottomopts != null) {
                    $("<div id=\"ge-bottom\"></div>").css("width", "100%").css("padding", 0).css("margin", 0).css("float","left")
                    .css("border", "solid").css("border-color", "#aaa").css("border-width", "0px 0px 0px 0px").appendTo( type_log )
                    .qsperiods(o.bottomopts);
                }
                for(i = 0; i < o.fields.length; i++) {
                    if(o.fields[i].type=="color") {
                        $("#"+pre+"input-"+i).simpleColor({
                            border: '1px solid #333333',
                            boxHeight: '25px',
                            displayColorCode: true
                        });    
                    }
                    if(o.fields[i].type=="location") {
                        if($( "#"+pre+"input-"+i ).val() == "") {
                            $( "#"+pre+"input-"+i ).button().click(function() { $.qsglobal.currcoord = $(this); setmap('0,0',$( "#"+pre+"input-"+i ),true);});
                        } else {
                            $( "#"+pre+"input-"+i ).button().click(function() { $.qsglobal.currcoord = $(this); setmap($( this ).val(),$( "#"+pre+"input-"+i ),false);});
                        }    
                    }
                    if(o.fields[i].type=="toggle") {
                        $( "#"+pre+"inputchoice-"+i ).buttonset();
                        $( "#"+pre+"input-"+i ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                    }

                    if(o.fields[i].type=="weekdays") {
                        $( "#"+pre+"input-"+i).buttonset();
                        $( "#"+pre+"sunday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                        $( "#"+pre+"monday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                        $( "#"+pre+"tuesday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                        $( "#"+pre+"wednesday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                        $( "#"+pre+"thursday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                        $( "#"+pre+"friday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                        $( "#"+pre+"saturday" ).button().click(function() {$(this).val( $(this).val()=="0"?"1":"0" )});
                    }
                    allFields.add($("#input-"+i));
                    //$( "#typechoice" ).buttonset();
                    if(o.multipletypes) {
                        $("#"+pre+"container-"+i).addClass(pre+"qschoice-"+o.fields[i].choicenum).addClass(pre+"qschoice-all");
                        if(o.fields[i].type=="multitype") {
                            $("#"+pre+"input-"+i).buttonset();
                            $.each(o.fields[i].multipletypes, function(key,val) {
                                $( "#"+pre+"choice-"+key ).attr("choicename",o.fields[i].choicename);
                                $( "#"+pre+"choice-"+key ).button().click(function() {    
                                    $( "."+pre+"qschoice-all" ).hide();
                                    $( "."+pre+"qschoice-"+key ).show();
                                    $( "."+pre+"qschoice--1").show();
                                    o.choiceval[$(this).attr("choicename")] = key;
                                });
                            });    
                        }
                    }
                }
                for(i = 0; i < o.fields.length; i++) {
                    if(o.multipletypes) {
                        if(o.fields[i].type=="multitype") {
                            $.each(o.fields[i].multipletypes, function(key,val) {
                                if($("#"+pre+"choice-"+key).attr("checked") == "checked") {
                                    $( "."+pre+"qschoice-all" ).hide();
                                    $( "."+pre+"qschoice-"+key ).show();
                                    $( "."+pre+"qschoice--1").show();
                                    o.choiceval[o.fields[i].choicename] = key;
                                }
                            });
                        }
                    }
                }
                
                tips = $( ".validateTips" );
                 
                obj.dialog({
		    autoOpen: false,
		    width: (doublecol?950:750),
		    modal: true,
		    buttons: [
                    {
                        text: o.tr(o.savebutton),
                        click: function() {
                            if(validate()) {
                                allFields.removeClass( "ui-state-error" );
                                o.savefunction(o);
                                $( this ).dialog( "close" );
                            }
                        }
                    },
                    {
                        text: o.tr(o.cancelbutton),
                        click: function() {
                            o.cancelfunction(o);
                            $( this ).dialog( "close" );
                        }
                    }],
                    close: function() {
                        allFields.val( "" ).removeClass( "ui-state-error" );
                    }
		});
                 
            });
        },
        qsperiods: function(opts) {          
            $( this ).empty();
            
            //Settings list and the default values
            var defaults = {
                name: "",
                attr: "",
                jsondel: "",
                parentid: -1,
                parentidname: "",
                addfunction: null,
                editfunction: null,
                globalobj: null, 
                writeperiod: null
            };
            
            var o = $.extend(defaults, opts);
            return this.each(function() {
                var obj = $(this);
                var perioddiv = $("<div></div>").addClass("perioddiv").appendTo(obj);
                var lbar = $("<div id=\"periodbar\"></div>").appendTo(perioddiv).css("padding", "5px 0px 0 0px")
                lbar.css('width','100%').css('height','32px');
                $("<div></div>").html(tr(o.name)).css('padding', '5px 0 0 10px').css('margin-right','20px').css('float','left').appendTo(lbar);
                
                $( "<span><button id=\"periodadd\"></button></span>").css('float','left').appendTo(lbar).css('height', '32').css('background', '#a0b4d2')
                    .button({text: false, icons: {primary: "ui-icon-plusthick"}}).click(function() {
                        o.addfunction();
                        obj.qsperiods(opts);
                    });
                    
                var periodmap = [];
                
                $( "<span><button id=\"periodtrash\"></button></span>").css('float','left').appendTo(lbar).css('height', '32')
                    .css('background', '#a0b4d2').button({text: false, icons: {primary: "ui-icon-trash"}}).click(function() {
                        rem = [];
                        $( ".ui-selected", ".periodlist" ).each(function() {
                            var ind = $("#currperiodlist li").index(this);
                            rem.push(ind);
                            var sub=0;
                            $.each(rem, function(key,val) {
                                if(val<ind) {
                                    sub++;
                                }
                            });
                            ind=ind-sub;
                            var periodinfo = {token:$.qsglobal.session_token, id:$( this ).attr( o.attr )};
                            postjson($.qsglobal.dbaddr+o.jsondel, periodinfo, function(data) {
                                if(data.success == "true")
                                {
                                    o.globalobj.splice(periodmap[ind],1);
                                } else {
                                    alert(tr("Failed to delete"));
                                }
                            }, false, null);
			});
                        obj.qsperiods(opts);
                    });
                
                var ulist = $('<ul class="periodlist" id="currperiodlist"></ul>').css('height','98%').css('overflow-y', 'scroll').appendTo( perioddiv );
                ulist.selectable({ filter: "li", cancel: ".ui-selected" });
                
                var periodind = 0;
                $.each(o.globalobj, function(key,val) {
                    if(val[o.parentidname] == o.parentid) {
                        temp = $( "<li></li>" ).html(o.writeperiod(val)).addClass("qstableline").attr(o.attr, val.id).dblclick( function() {o.editfunction(key,val);});
                        ulist.append(temp);
                        periodmap.push(periodind);
                    }
                    periodind++;
                });
            });
        }
    });
})(jQuery);
    
function elem2str(o,id)
{
    var pre = o.prefix;
    var elem = o.fields[id];
    var item = (o.ind==-1?null:o.item);
    var width = o.width;
    
    var ret = "";
    if(elem.type == "text" || elem.type == "date" || elem.type == "time" || elem.type == "numeric") {
        ret += '<div id="'+pre+'container-'+id+'"><label style="display: inline-block; width: '+width+'%; height: 25px;" for="'+pre+'input-'+id+'">'+o.tr(elem.name)+'</label>'+
        '<input type="text" id="'+pre+'input-'+id+'" value="'+(item==null?elem.defval:(item[elem.itemname]==null?"":item[elem.itemname]))+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:'+(95-width)+'%"/></br></div>';
    } else if(elem.type == "location") {
        ret += '<div id="'+pre+'container-'+id+'"><label style="display: inline-block; width: '+width+'%; height: 25px;" for="'+pre+'input-'+id+'">'+o.tr(elem.name)+'</label>'+
        '<input type="button" id="'+pre+'input-'+id+'" value="'+(item==null?elem.defval:(item[elem.itemname]==null?"":item[elem.itemname]))+'" class="text ui-widget-content ui-corner-all" style="display: inline-block; width:'+(95-width)+'%"/></br></div>';
    } else if(elem.type == "color") {
        ret += '<div id="'+pre+'container-'+id+'"><label style="display: inline-block; width: '+width+'%; height: 25px;" for="'+pre+'input-'+id+'">'+o.tr(elem.name)+'</label>'+
        '<input style="display: inline-block;" id="'+pre+'input-'+id+'" value="'+(item==null?elem.defval:(item[elem.itemname]==null?"":item[elem.itemname]))+'"></br></div>';
    } else if(elem.type == "multitype") {
        ret += '<div id="'+pre+'container-'+id+'"><div id="'+pre+'input-'+id+'" class="multitype">';
        $.each(elem.multipletypes, function(key,val) {
            if((item == null && key==0) || elem.typechoice==key) {
                ret += '<input type="radio" id="'+pre+'choice-'+key+'" name="radio" checked="checked"/><label for="'+pre+'choice-'+key+'">'+val.name+'</label>';
            } else {
                ret += '<input type="radio" id="'+pre+'choice-'+key+'" name="radio" /><label for="'+pre+'choice-'+key+'">'+val.name+'</label>';
            }
        });        
        ret += '</div></br></div>';
    } else if(elem.type == "toggle") {
        if((item != null && item[elem.itemname]=="0") || (item == null && elem.defval=="0")) {
            ret += '<div id="'+pre+'inputchoice-'+id+'" style="right;padding: 0 0 10px 0;"><input type="checkbox" id="'+pre+'input-'+id+'" value="0" /><label for="'+pre+'input-'+id+'">'+o.tr(elem.name)+'</label></div>';
        } else {
            ret += '<div id="'+pre+'inputchoice-'+id+'" style="padding: 0 0 10px 0;"><input type="checkbox" id="'+pre+'input-'+id+'" value="1" checked="checked"/><label for="'+pre+'input-'+id+'">'+o.tr(elem.name)+'</label></div>';
        }
    } else if(elem.type == "weekdays") {
        ret+='<div id="'+pre+'container-'+id+'">';
        if(elem.name != "" && elem.name != null) {
            ret+='<style="display: inline-block; width: '+width+'%; height: 25px;">'+o.tr(elem.name)+'</div><div id="'+pre+'input-'+id+'" style="float: right;padding: 0 0 10px 0;">';
        } else {
            ret+='<div id="'+pre+'input-'+id+'" style="float: left;padding: 0 200 100px 0;">';
        }
        var wday = (item != null?parseInt(item.weekdays):parseInt('127'));
        
        var bo = wday>63;
        
        if(wday>=64) {
            ret+='<input type="checkbox" id="'+pre+'sunday" value="1" checked="checked"/><label for="'+pre+'sunday">'+o.tr('Su')+'</label>';
        } else {
            ret+='<input type="checkbox" id="'+pre+'sunday" value="0"/><label for="'+pre+'sunday">'+o.tr('Su')+'</label>';
        }
        wday=wday%64;
        
        if(wday>=32) {
            ret+='<input type="checkbox" id="'+pre+'monday" value="1" checked="checked"/><label for="'+pre+'monday">'+o.tr('Mo')+'</label>';
        } else {
            ret+='<input type="checkbox" id="'+pre+'monday" value="0"/><label for="'+pre+'monday">'+o.tr('Mo')+'</label>';
        }
        wday=wday%32;
        if(wday>=16) {
            ret+='<input type="checkbox" id="'+pre+'tuesday" value="1" checked="checked"/><label for="'+pre+'tuesday">'+o.tr('Tu')+'</label>';
        } else {
            ret+='<input type="checkbox" id="'+pre+'tuesday" value="0"/><label for="'+pre+'tuesday">'+o.tr('Tu')+'</label>';
        }
        wday=wday%16;
        if(wday>=8) {
            ret+='<input type="checkbox" id="'+pre+'wednesday" value="1" checked="checked"/><label for="'+pre+'wednesday">'+o.tr('We')+'</label>';
        } else {
            ret+='<input type="checkbox" id="'+pre+'wednesday" value="0"/><label for="'+pre+'wednesday">'+o.tr('We')+'</label>';
        }
        wday=wday%8;
        if(wday>=4) {
            ret+='<input type="checkbox" id="'+pre+'thursday" value="1" checked="checked"/><label for="'+pre+'thursday">'+o.tr('Th')+'</label>';
        } else {
            ret+='<input type="checkbox" id="'+pre+'thursday" value="0"/><label for="'+pre+'thursday">'+o.tr('Th')+'</label>';
        }
        wday=wday%4;
        if(wday>=2) {
            ret+='<input type="checkbox" id="'+pre+'friday" value="1" checked="checked"/><label for="'+pre+'friday">'+o.tr('Fr')+'</label>';
        } else {
            ret+='<input type="checkbox" id="'+pre+'friday" value="0"/><label for="'+pre+'friday">'+o.tr('Fr')+'</label>';
        }
        wday=wday%2;
        if(wday>=1) {
            ret+='<input type="checkbox" id="'+pre+'saturday" value="1" checked="checked"/><label for="'+pre+'saturday">'+o.tr('Sa')+'</label>';
        } else {
            ret+='<input type="checkbox" id="'+pre+'saturday" value="0"/><label for="'+pre+'saturday">'+o.tr('Sa')+'</label>';
        }
        ret+='</div></div>';
    }
    return ret;
}

function validate() {
    return true;
}

