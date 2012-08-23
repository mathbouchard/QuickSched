/*
 * QuickSchedule Gantt jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        ganttScreen: function(opts) {
            
            var defaults = {
                data: null,
                mult: 2,
                params: {timestep:15},
                currw: 800,
                hoff: 0,
                moff: 50,
                itemname: 'item',
                onclick: function() { alert('click'); }
            };
             
            var options = $.extend(defaults, opts);
            
            return this.each(function() {
                var obj = $(this);
                obj.empty();
                //obj.addClass("ganttcontainer").css('width',options.currw);   
                
                
                options.currw = options.currw-180;
                
                if(options.data != null)
                {
                    
                    var wmin = options.currw;
                    var wmax = 0;
                    var count=0;
                    $.each(options.data, function(key,val) {
                        if(ganttval(val.starttimel, options.currw, options.mult) < wmin) {
                            wmin = ganttval(val.starttimel, options.currw, options.mult);
                        }
                        if(ganttval(val.starttimel, options.currw, options.mult)+ganttvald(val.starttimel, val.starttimeu, val.durationu, options.currw, options.mult) > wmax) {
                            wmax = ganttval(val.starttimel, options.currw, options.mult)+ganttvald(val.starttimel, val.starttimeu, val.durationu, options.currw, options.mult);
                        }
                        count++;
                    });
                    wmin=0;
                    maxwidth = options.currw;
                    if((wmax-wmin)+20 > maxwidth)
                        maxwidth = (wmax-wmin)+20;
                    
                    var currh = $(window).height()-options.hoff-options.moff;
                    var maxh = $(window).height()-options.hoff-options.moff;
                    
                    if(180+count*50 > currh)
                        currh = 180+count*50;
                    var backl =  ganttval('1:00', options.currw, options.mult);
                    
                    
                    $( "<div></div>" ).addClass("gantthead").css('top', options.moff+20).css('width', maxwidth).css('left', 140).appendTo( obj );
                    
                    for(i=0; i*backl+20<maxwidth; i+=2) {
                        $( "<div></div>" ).text(i%24+':00').addClass("gantttime").css('width', backl).css('left', 140+(i-0.5)*backl)
                        .css('top', options.moff+20).appendTo( obj );
                        $( "<div></div>" ).text((i+1)%24+':00').addClass("gantttime").css('width', backl).css('left', 140+(i+0.5)*backl)
                        .css('top', options.moff+35).appendTo( obj );
                    }
                    var inside = $( "<div></div>" ).addClass("ganttinside").css('overflow-y','scroll').css('top', 51).css('width', 160+maxwidth)
                    .css('left', 0).css('height',maxh-117).css('position','absolute').appendTo( obj );
                    
                    for(i=0; (i-i%2)*backl+20<maxwidth; i++) {
                        if(i%24==0) {
                            $( "<div></div>" ).addClass("ganttback").css('width', backl).css('border-color', '#999').css('left', 140+i*backl)
                            .css('top', options.moff+0).css('height', currh-117).appendTo( inside );//appendTo( obj );
                        } else {
                            $( "<div></div>" ).addClass("ganttback").css('width', backl).css('left', 140+i*backl)
                            .css('top', options.moff+0).css('height', currh-117).appendTo( inside );//.appendTo( obj );
                        }
                    }
                    
                    var ulist = $('<ul class="ganttlist '+options.itemname+'list" id="curr'+options.itemname+'list"></ul>')
                        .selectable({ filter: "li", cancel: ".ui-selected, .ganttblockadd" }).appendTo( inside );//.appendTo( obj );
                    
                    var gblock = $( "<li></li>" ).text('Add new '+options.itemname+'.').css('width', options.currw+110).addClass("ganttblock").addClass("ganttblockadd")
                        .css('top', options.moff).attr("objid", -1).appendTo( ulist );
                    gblock.click(function() {options.onclick('New '+options.itemname,-1);});
                    
                    var it = 0;
                    $.each(options.data, function(key,val) {
                        var gblockin = $( "<li></li>" ).css('width', maxwidth+110).addClass("ganttblock").attr("objid", val.id)
                            .css('top', 50+it*50+options.moff).appendTo( ulist );
                        gblockin.dblclick(function() {options.onclick(val.name, key)});
                        $( "<div></div>" ).text(val.name).addClass("leftganttblock").attr("objid", val.id).appendTo( gblockin );
                        $( "<div></div>" ).css('width', ganttvald(val.starttimel, val.starttimeu, val.durationu, options.currw, options.mult))
                        .css('left', 110+ganttval(val.starttimel, options.currw, options.mult)).addClass("rigthganttblock")
                        .css('background', val.color).attr("objid", val.id).appendTo( gblockin );
                        it++;
                    });
                }
                
                /*ulist.sortable({
                    items: "li:not(.waddblock)",
                    sort: function() {
                        $( this ).removeClass( "ui-state-default" );
                    }
                });*/
            });
            
        }
    });
})(jQuery);

function ganttval(deb, currw, mult) {
    var n=deb.split(":");
    return (parseFloat(n[0])+parseFloat(n[1])/60.0)/(24.0*mult)*currw;
    
}

function ganttvald(debl, debu, dur, currw, mult) {
    return ganttval(debu, currw, mult)-ganttval(debl, currw, mult)+ganttval(dur, currw, mult);
}
