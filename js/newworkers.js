/*
 * QuickSchedule Workers jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        workersScreen: function(opts) {     
            return this.each(function() {
                var obj = $(this);
                obj.empty();
				
                var ulist = $('<ul></ul>').appendTo( $( this ) );
         
                if($.qsglobal.workers != null)
                {
                    temp = $( "<li></li>" ).html('<img src="img/plus.png"></img><div class="wblocktext">Add a new worker</div>').addClass("wblock").addClass("waddblock").attr("workerid", -1);
                    ulist.append(temp);
                    $.each($.qsglobal.workers, function(key,val) {
                        var imglink = "img/someone_wb.png";
                        if(val.picturelink != null) {
                            imglink = val.picturelink;  
                        } 
			//alert( "VAL : " + val.id );
                        temp = $( "<li></li>" ).html('<img src="'+imglink+'"></img><div style="z-index: 0; position:relative;" class="wblocktext" id="workerdiv'+val.id+'" workerid="'+val.id+'"><h3>'+val.firstname+" "+val.lastname+'</h3>'+val.code+'</div>').addClass("wblock").attr("workerid", val.id);
			temp.click( function() {
			    $(this).workersInterface( val );
			});
                        ulist.append(temp);
                    });
                }
                
                /*ulist.sortable({
                    items: "li:not(.waddblock)",
                    sort: function() {
                        $( this ).removeClass( "ui-state-default" );
                    }
                });*/
                ulist.selectable({ filter: "li", cancel: ".ui-selected, .waddblock" });
            });
        },
        workersInterface: function(opts) {
	    //alert( opts );
            //Settings list and the default values
            var defaults = {
                title: 'Login',
                background: '#eee'
            };
             
            var options = $.extend(defaults, opts);

//	    trace( "option = " + options.id );		
	    return this.each( function() {
                var o =options;
                var obj = $(this);
				
		var mydiv = $("#workerdiv" + o.id);
		//alert( "o = " + o.id + " : " + mydiv );
		var div_interf;
		if( $("#interf-worker" + o.id).length ) {
		    div_interf = $("#interf-worker" + o.id);
		    div_interf.remove();
		    mydiv.css('z-index', 0);
		}
		else
		{
		    div_interf = $('<div style="width: 180px; height: 150px; padding: 0.5em; background-color:rgb(160,180,210);" id="interf-worker'+o.id+'" title="' + o.firstname + ' ' + o.lastname +'"></div>' ).appendTo( mydiv );
			div_interf.append($('<form></form>').html(
                        '<fieldset>'+
                        '<label for="lname">First name</label>'+
                        '<input type="text" name="name" id="lname" class="text ui-widget-content ui-corner-all" />'+
                        '<label for="lpassword">Last name</label>'+
                        '<input type="text" name="password" id="lpassword" value="" class="text ui-widget-content ui-corner-all" />'+
                        '</fieldset>'));
					
                    // attache
                    mydiv.css('z-index', 10000+o.id);
                    
                    // avec dialog
              //      div_interf.dialog();
					
            
                    div_interf.show();
            /*        
                    alert( "dialog" );
                    alert( "this " + $( this ).attr("workerid") );
                    alert( $( this ).parent() );
                    alert( $( this ).parent().attr("workerid") );
                    */
                    //$( this ).parent().css({ 'z-index': 123});

  /*                  var oriZ2 = $( this ).style("z-index");
                    //alert( "oriZ : " + oriZ );
                    $( this ).style('z-index', 123);
                    var oriZ2 = $( this ).css("z-Index");
                    //alert( "oriZ2 : " + oriZ2 );*/
                    
/*					var zIndex = div_interf.dialog( "option", "zIndex" );
                    alert( zIndex );
                    */
//					div_interf.dialog(/*{ zIndex: 54 }*/);
/*					var zIndex = div_interf.dialog( "option", "zIndex" );
                    alert( zIndex );
                    var zInd2 = div_interf.dialog( "option", "zIndex" );
                    alert( zInd2 );*/
		}
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
}