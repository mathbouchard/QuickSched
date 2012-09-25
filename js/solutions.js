/*
 * QuickSchedule Solutions jQuery plugin
 *
 * Copyright 2012, Steve Vallerand
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        solutionsScreen: function(opts) {
	
            var defaults = {
                loff: 0,
                toff: 0
            };
             
            var options = $.extend(defaults, opts);
	    
	    function drawCalendar(container)
	    {
		var HourToPx = 42;
		var dateshown = [ "2012-09-01"];//, "2012-09-02", "2012-09-03", "2012-09-04" ];
		
        /*
		// ca va prendre un div sur le root pour le minicalendrier
		// sinon, il y a un div sans id qui est creer par la fonction dialog
		// sur le root
		var udiv = $('<div id="minicalendar"></div>').appendTo( container );
		//udiv.attr( 'id', 'datepicker' );
		$("#minicalendar").datepicker({
			onSelect: function(dateText, inst) { alert( dateText ); }
		}
		);
		//$(".ui-datepicker-calendar").css("background-color", '#95A0FF');
		$("#minicalendar").dialog();
		$(".ui-datepicker-calendar").selectable();*/
		
		var gridcontain = $('<div id="gridcontain" class="mygrid"></div>').appendTo( container );
		
		/************ first div *************/
		var topcontain = $('<div id="topcontain" class="mytop"></div>').appendTo( gridcontain );
		
		var toptable = $('<table class="mytoptable"></table>').appendTo( topcontain );
		toptable.attr( 'id', 'toptable' );
		
		var toptablebody = $('<tbody class="mytoptablebody"></tbody>').appendTo( toptable );
		
		var firsttr = $('<tr class="wk-daynames"></tr>').appendTo( toptablebody );
		var firsttrtd = $('<td class="tzlabel" style="width: 54px;" rowspan="3"></td>').appendTo( firsttr );
		firsttrtd.text( 'GMT-05' );
		
		for( var i=1; i<=dateshown.length; i++ )
		{
			var dateth = $('<th scope="col" class="headcol" style="width: '+ 100/dateshown.length + '%"></th>').appendTo( firsttr );
			dateth.attr( 'title', 'date ' + i );
			
			var datethdiv = $('<div class="datethdiv"></div>').appendTo( dateth );
			
			var datespan = $('<span class="daylink" style="cursor: pointer;"></span>').appendTo( datethdiv );
			datespan.text( 'date ' + i );
		}

		var dummyth = $('<th class="wk-dummy" rowspan="3" style="width: 17px;"></th>').appendTo( firsttr );
	
		//var secondtr = $('<tr class="alldaytr"></tr>').appendTo( toptablebody );
		var secondtr = $('<tr></tr>').appendTo( toptablebody );
		var secondtrtd = $('<td class="allday" colspan="'+ dateshown.length +'"></td>').appendTo( secondtr );
		var seconddiv = $('<div class="alldaydiv"></div>').appendTo( secondtrtd );
		
		var secondone = $('<table cellpadding="0" cellspacing="0" class="tableone" style="height: 13px;"></table>').appendTo( seconddiv );
		var seconebody = $('<tbody class="seconebody"></tbody>').appendTo( secondone );
		var seconetr = $('<tr class="seconetr"></tr>').appendTo( seconebody );
		
		for( var i=1; i<=dateshown.length; i++ )
		{
			var otd = $('<td class="st-bg"> </td>').appendTo( seconetr );
		}
		/*
		var otd1 = $('<td class="st-bg-next"> </td>').appendTo( seconetr );
		var otd2 = $('<td class="st-bg"> </td>').appendTo( seconetr );
		var otd3 = $('<td class="st-bg-today"> </td>').appendTo( seconetr );
		var otd4 = $('<td class="st-bg-next2"> </td>').appendTo( seconetr );
		*/
		
		var secondtwo = $('<table cellpadding="0" cellspacing="0" class="st-grid"></table>').appendTo( seconddiv );
		var sectwobody = $('<tbody class="sectwobody"></tbody>').appendTo( secondtwo );
		var sectwotr = $('<tr class="sectwotr"></tr>').appendTo( sectwobody );

		for( var i=1; i<=dateshown.length; i++ )
		{
			var ttd = $('<td class="st-s"> </td>').appendTo( sectwotr );
		}
		/*
		var ttd1 = $('<td class="st-s"> </td>').appendTo( sectwotr );
		var ttd2 = $('<td class="st-s"> </td>').appendTo( sectwotr );
		var ttd3 = $('<td class="st-s"> </td>').appendTo( sectwotr );
		var ttd4 = $('<td class="st-s"> </td>').appendTo( sectwotr );
		*/

		var sectwotr2 = $('<tr class="sectwotr2"></tr>').appendTo( sectwobody );
		
		var thirdtr = $('<tr class="wk-webcontent"></tr>').appendTo( toptablebody );
		
		var xtd1 = $('<td class="wk-webcontent-td"></td>').appendTo( thirdtr );
		var xtd2 = $('<td class="wk-webcontent-td"></td>').appendTo( thirdtr );
		var xtd3 = $('<td class="wk-webcontent-td"></td>').appendTo( thirdtr );
		var xtd4 = $('<td class="wk-webcontent-td"></td>').appendTo( thirdtr );
		
		/************ second div *************/
		var border = $('<div id=border" class="myborder"></div>').appendTo( gridcontain );

		/************ third div *************/
		var maincontain = $('<div id=timeevent" class="mytimeevent"></div>').appendTo( gridcontain );

		var maindiv = $('<div class="maindiv" style="margin-top: 0px;"></div>').appendTo( maincontain );

		var maintable = $('<table id="maintable" class="mytableevent" cellpadding="0" cellspacing="0" style="height:1010px"></table>').appendTo( maindiv );
		
		var mainbody = $('<tbody></tbody>').appendTo( maintable );
		
		var mbfirsttr = $('<tr height="1"></tr>').appendTo( mainbody );
		
		var mbfirsttd = $('<td style="width:60px;"></td>').appendTo( mbfirsttr );
		var mbsecondtd = $('<td colspan="'+dateshown.length+'"></td>').appendTo( mbfirsttr );
		var mbsdivA = $('<div class="tgspanwrap"></div>').appendTo( mbsecondtd );
		var mbsdivB = $('<div class="hourmarkers"></div>').appendTo( mbsdivA );
		
		for( var t=1; t<=24; t++ )
		{
			var ahourdiv = $('<div class="markercell"></div>').appendTo( mbsdivB );
			var dualdiv = $('<div class="dualmarker"></div>').appendTo( ahourdiv );
		}
		
		
		var mbsecondtr = $('<tr></tr>').appendTo( mainbody );

		var mbstime = $('<td class="mytimecol"></td>').appendTo( mbsecondtr );
		for( var t=1; t<=24; t++ )
		{
			var atimediv = $('<div style="height: 42px;"></div>').appendTo( mbstime );
			var innerdiv = $('<div class="timeinfo" style="height: 41px;"></div>').appendTo( atimediv );
			if( t > 12 )
				innerdiv.text( (t-12) + 'pm' );
			else
				innerdiv.text( t + 'am' );
		}
		// lasttimeline = petite fleche qui indique l'heure actuelle
		var lasttimeline = $('<div class="tgnowptr" style="left: 0px; top: 602px;"></div>').appendTo( mbstime );
		
		for( var i=1; i<=dateshown.length; i++ )
		{
			var maincol = $('<td id="col'+i+'" class="mcol"></td>').appendTo( mbsecondtr );
			var maincoldiv = $('<div id="tg'+i+'" class="mcew" style="height: 1008px;"></div>').appendTo( maincol );
			var maincolove = $('<div id="to'+i+'" class="mcow"></div>').appendTo( maincol );
		}
		
/*		var tggutter = $('<div id="gutter" class="tg-gutter"></div>').appendTo( $("#col1") );
		//$('#gutter').text("<div class='ca-evp204 chip' style='top:735px;left:-1px;width:42.5%;'><dl class='cbrd' style='height:119px;border-color:#7BD148;background-color:#DAF2CC;color:#777777;'><dt style='background-color:;'>5:30p – 8:30p <i class='cic cic-dm  cic-tmr' title='Reminders'>&nbsp;</i></dt><dd><span class='evt-lk ca-elp204'>(No title)</span></dd><div><div class='mask mask-top' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-bottom' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-left' style='height:122px;border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-right' style='height:122px;border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div></div><div class='resizer'><div class='rszr-icon'>&nbsp;</div></div></dl></div><div class='ca-evp205 chip ' style='top:861px;left:-1px;width:42.5%;'><dl class='cbrd' style='height:98px;border-color:#7BD148;background-color:#DAF2CC;color:#777777;'><dt style='background-color:;'>8:30p – 11p <i class='cic cic-dm  cic-tmr' title='Reminders'>&nbsp;</i></dt><dd><span class='evt-lk ca-elp205'>(No title)</span></dd><div><div class='mask mask-top' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-bottom' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-left" style="height:101px;border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-right' style='height:101px;border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div></div><div class='resizer'><div class='rszr-icon'>&nbsp;</div></div></dl></div><div class='ca-evp206 chip-border chip-color chip' style='top:756px;left:25%;width:42.5%;'><dl class='cbrd' style='height:119px;border-color:#7BD148;background-color:#DAF2CC;color:#777777;'><dt style='background-color:;'>6p – 9p <i class='cic cic-dm  cic-tmr' title='Reminders'>&nbsp;</i></dt><dd><span class='evt-lk ca-elp206'>(No title)</span></dd><div><div class='mask mask-top' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-bottom' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class="mask mask-left" style="height:122px;border-color:#7BD148;background-color:#DAF2CC;">&nbsp;</div><div class="mask mask-right" style="height:122px;border-color:#7BD148;background-color:#DAF2CC;">&nbsp;</div></div><div class="resizer"><div class="rszr-icon">&nbsp;</div></div></dl></div><div class='ca-evp207 chip-border chip-color chip ' style='top:882px;left:25%;width:42.5%;'><dl class='cbrd' style='height:98px;border-color:#7BD148;background-color:#DAF2CC;color:#777777;'><dt style='background-color:;'>9p – 11:30p <i class='cic cic-dm  cic-tmr' title='Reminders'>&nbsp;</i></dt><dd><span class='evt-lk ca-elp207'>(No title)</span></dd><div><div class='mask mask-top' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-bottom' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-left' style='height:101px;border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-right' style='height:101px;border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div></div><div class='resizer'><div class='rszr-icon'>&nbsp;</div></div></dl></div><div class='ca-evp208 chip-border chip-color chip' style='top:798px;left:50%;width:42.5%;'><dl class='cbrd' style='height:119px;border-color:#7BD148;background-color:#DAF2CC;color:#777777;'><dt style='background-color:;'>7p – 10p <i class='cic cic-dm  cic-tmr' title='Reminders'>&nbsp;</i></dt><dd><span class='evt-lk ca-elp208'>(No title)</span></dd><div><div class='mask mask-top' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-bottom' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-left' style='height:122px;border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-right' style='height:122px;border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div></div><div class='resizer'><div class='rszr-icon'>&nbsp;</div></div></dl></div><div class='ca-evp209 chip-border chip-color chip ' style='top:882px;left:75%;width:25%;'><dl class='cbrd' style='height:98px;border-color:#7BD148;background-color:#DAF2CC;color:#777777;'><dt style='background-color:;'>9p – 11:30p <i class='cic cic-dm  cic-tmr' title='Reminders'>&nbsp;</i></dt><dd><span class='evt-lk ca-elp209'>(No title)</span></dd><div><div class='mask mask-top' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-bottom' style='border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-left' style='height:101px;border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div><div class='mask mask-right' style='height:101px;border-color:#7BD148;background-color:#DAF2CC;'>&nbsp;</div></div><div class='resizer'><div class='rszr-icon'>&nbsp;</div></div></dl></div>");
		$('#gutter').html('<div class="ca-evp204 chip" style="top:735px;left:-1px;width:42.5%;"><dl class="cbrd" style="height:119px;border-color:#7BD148;background-color:#DAF2CC;color:#777777;"><dt style="background-color:;">5:30p – 8:30p <i class="cic cic-dm  cic-tmr" title="Reminders">&nbsp;</i></dt><dd><span class="evt-lk ca-elp204" style="cursor: pointer; ">(No title)</span></dd><div><div class="mask mask-top" style="border-color:#7BD148;background-color:#DAF2CC;">&nbsp;</div><div class="mask mask-bottom" style="border-color:#7BD148;background-color:#DAF2CC;">&nbsp;</div><div class="mask mask-left" style="height:122px;border-color:#7BD148;background-color:#DAF2CC;">&nbsp;</div><div class="mask mask-right" style="height:122px;border-color:#7BD148;background-color:#DAF2CC;">&nbsp;</div></div><div class="resizer"><div class="rszr-icon">&nbsp;</div></div></dl></div>');
*/


		// process data
		var byDate = new Object();
		
		for( s=0; s<$.qsglobal.solution.length; s++ )
		{
			if( $.qsglobal.solution[s].startdate == $.qsglobal.solution[s].enddate )
			{
				if( byDate.hasOwnProperty( $.qsglobal.solution[s].startdate ) == false )
				{
					var thisdateworkers = new Object();
					byDate[ $.qsglobal.solution[s].startdate ] = thisdateworkers;
				}
				if( byDate[ $.qsglobal.solution[s].startdate ].hasOwnProperty( $.qsglobal.solution[s].workerid ) == false )
				{
					if( byDate[ $.qsglobal.solution[s].startdate ].hasOwnProperty( "workercount" ) )
						byDate[ $.qsglobal.solution[s].startdate ].workercount++;
					else
						byDate[ $.qsglobal.solution[s].startdate ].workercount = 1;
					byDate[ $.qsglobal.solution[s].startdate ][ $.qsglobal.solution[s].workerid ] = new Object();
					var thisworkersshift = new Array();
					var thisworkerstask = new Array();
					byDate[ $.qsglobal.solution[s].startdate ][ $.qsglobal.solution[s].workerid ].shifts = thisworkersshift;
					byDate[ $.qsglobal.solution[s].startdate ][ $.qsglobal.solution[s].workerid ].tasks = thisworkerstask;
				}
				if( $.qsglobal.solution[s].type == "0" )
					byDate[ $.qsglobal.solution[s].startdate ][ $.qsglobal.solution[s].workerid ].shifts.push( $.qsglobal.solution[s] );
				else
					byDate[ $.qsglobal.solution[s].startdate ][ $.qsglobal.solution[s].workerid ].tasks.push( $.qsglobal.solution[s] );
			}
		}
		
/*		for( bd in byDate )
		{
			for( wo in byDate[ bd ] )
			{
				alert( "worker = " + wo );
				for( sf in byDate[ bd ][ wo ].shifts )
				{
					alert( "Shift : " + byDate[ bd ][ wo ].shifts[ sf ].starttime + " : " + byDate[ bd ][ wo ].shifts[ sf ].endtime );
				}
				for( tk in byDate[ bd ][ wo ].tasks )
				{
					alert( "Task : " + byDate[ bd ][ wo ].tasks[ tk ].starttime + " : " + byDate[ bd ][ wo ].tasks[ tk ].endtime );
				}
			}
		}*/
		
		for( var d=0; d<dateshown.length; d++ )
		{
			if( !byDate.hasOwnProperty( dateshown[d] ) )
				continue;
			
			var sizecolpercent = 100 / byDate[ dateshown[d] ].workercount;
			var poscolpercent = 0;
			
			// selectionner la bonne colonne selon d
			var colid = d + 1;
			var colname = "col" + colid;
			
			// ajouter conteneur pour visuel
			var tggutter = $('<div id="gutter'+colid+'" class="tg-gutter"></div>').appendTo( $("#"+colname) );

			for( wk in byDate[ dateshown[d] ] )
			{
				if( wk == "workercount" )
					continue;
				if( !byDate[ dateshown[d] ].hasOwnProperty( wk ) ) // conseiller car peut avoir des objets imprevus venant d'un quelconque heritage
					continue;
			
				var myshiftid = "shift-" + dateshown[d] + "-" + wk;
				var shiftstart;
				for( sf in byDate[ dateshown[d] ][ wk ].shifts )
				{
					var stime = byDate[ dateshown[d] ][ wk ].shifts[sf].starttime.split( ":" );
					var etime = byDate[ dateshown[d] ][ wk ].shifts[sf].endtime.split( ":" );
					shiftstart = HourToPx*(stime[0]-1) + HourToPx*stime[1]/60.0; // pour le moment 0 = 1am; 1hr = 42px
					var stop = HourToPx*(etime[0]-1) + HourToPx*etime[1]/60.0;
					var len = stop - shiftstart;
					var content = $('#gutter'+colid).html();
//											$('#gutter'+colid).html(content + '<div class="chip" style="top:'+start+'px;left:'+poscolpercent+'%;width:'+sizecolpercent+'%;"><dl class="cbrd" style="height:' + len + 'px;border-color:#7BD148;background-color:' + $.qsglobal.workers[wk].color + ';color:#777777;-webkit-margin-before:0px;-webkit-margin-after:0px"><dt style="background-color:;">5:30p – 8:30p <i class="cic cic-dm  cic-tmr" title="Reminders">&nbsp;</i></dt><dd><span class="evt-lk ca-elp204" style="cursor: pointer; ">(No title)</span></dd></dl></div>');
					//$('#gutter'+colid).html(content + '<div id="'+myshiftid+'" class="chip chipShift" style="top:'+shiftstart+'px;left:'+poscolpercent+'%;width:'+sizecolpercent+'%;border-color: #000000; z-index:1000"><dl class="cbrd" style="height:' + len + 'px;border-color:#000000;background-color:' + $.qsglobal.workers[wk].color + ';color:#777777;-webkit-margin-before:0px;-webkit-margin-after:0px"></dl></div>');
                                        $('#gutter'+colid).html(content +
                                            '<div id="'+myshiftid+'" class="chip chipShift" style="top:'+shiftstart+'px;left:'+poscolpercent+'%;width:'+8*sizecolpercent/10+'%;height:' + len + 'px;border-color: #000000; z-index:1000">'+
                                            '<div style="width:15%;border-color: #000000; z-index:1000"><dl class="cbrd" style="height:' + len + 'px;border-color:#000000;background-color:' + $.qsglobal.workers[wk].color + ';color:#777777;-webkit-margin-before:0px;-webkit-margin-after:0px"></dl></div>'+
                                            '<div id="in-'+myshiftid+'" style="left:15%;width:85%;border-color: #000000; z-index:1000"><dl class="cbrd" style="height:' + len + 'px;border-color:#000000;background-color:' + 'transparent' + ';color:#777777;-webkit-margin-before:0px;-webkit-margin-after:0px"></dl></div>'+
                                            '<div/>'
                                            
                                            );
					content = $('#gutter'+colid).html();
                                        
					//$('#gutter'+colid).html(content + '<div id="Drag'+myshiftid+'" class="chip chipDragShift" data-staticmaster="'+myshiftid+'" style="top:'+shiftstart+'px;left:'+poscolpercent+'%;width:'+sizecolpercent+'%;border-color: #000000; z-index:1000"><dl class="cbrd" style="height:' + len + 'px;border-color:#000000;background-color:' + $.qsglobal.workers[wk].color + ';color:#777777;-webkit-margin-before:0px;-webkit-margin-after:0px"></dl></div>');
                                        $('#gutter'+colid).html(content + '<div id="Drag'+myshiftid+'" class="chip chipDragShift" data-staticmaster="'+myshiftid+'" style="top:'+shiftstart+'px;left:'+poscolpercent+'%;width:'+sizecolpercent+'%;border-color: #000000; border: 0; z-index:1000"><dl class="cbrd" style="height:' + len + 'px;border-color:#000000;background-color:' + 'transparent' + ';color:#777777;-webkit-margin-before:0px;-webkit-margin-after:0px"></dl></div>');
				}
				
				for( tk in byDate[ dateshown[d] ][ wk ].tasks )
				{
					var stime = byDate[ dateshown[d] ][ wk ].tasks[tk].starttime.split( ":" );
					var etime = byDate[ dateshown[d] ][ wk ].tasks[tk].endtime.split( ":" );
					var start = HourToPx*(stime[0]-1) + HourToPx*stime[1]/60.0 - shiftstart; // pour le moment 0 = 1am; 1hr = 42px
					var stop = HourToPx*(etime[0]-1) + HourToPx*etime[1]/60.0 - shiftstart;
					
/*					alert( start + ":" + stop );
					alert( "#gutter"+colid );
					alert( $("#gutter"+colid).offset().top );
					alert( $("#gutter"+colid).parent().offset().top );
					alert( $("#"+myshiftid).offset().top );
					alert( $("#"+myshiftid).parent().offset().top );*/
					var len = stop - start;
					var content = $('#'+myshiftid).html();
					var taskid = byDate[ dateshown[d] ][ wk ].tasks[tk].assignid;
					var mytaskid = "task-" + dateshown[d] + "-" + wk + "-" + taskid;
					
					$('#'+myshiftid).html(content + '<div class="chip chipTask" style="top:'+start+'px;left:35%;width:35%;border-radius: 0;border-color: #444; z-index:1500"><dl class="cbrd" style="height:' + len + 'px;border-color:#999999;background-color:' + $.qsglobal.tasks[taskid].color + ';color:#777777;-webkit-margin-before:0px;-webkit-margin-after:0px;border: 0;"></dl></div>');
					//$('#'+myshiftid).html(content + '<div class="chip" style="top:'+start+'px;left:25%;width:50%;border-radius: 20% 20% 20% 20%;border-color: #999999; z-index:1500"><dl class="cbrd" style="height:' + len + 'px;border-color:#999999;background-color:' + $.qsglobal.tasks[taskid].color + ';color:#777777;-webkit-margin-before:0px;-webkit-margin-after:0px;border-radius: 20% 20% 20% 20%;"></dl></div>');
				}
				
				poscolpercent += sizecolpercent;
			}
			$(".chipDragShift").draggable({
			   axis: "y",
			   containment: "#"+colname,
			   start: function(event, ui) { $(this).css( "z-index", 10000 ); },
			   stop: function(event, ui) { $(this).css( "z-index", 1000 ); },
			   drag: function(event, ui) {
				var dragobjectpos = parseInt($(this).css( "top" ));
				var staticobjectpos = parseInt($("#"+$(this).data( "staticmaster" )).css( "top" ));
				var diff = dragobjectpos-staticobjectpos;
				if( diff >= (HourToPx/4.0) ) // 4.0 pour avoir quart d'heure
				{
					var newpos = staticobjectpos + (HourToPx/4.0);
					var strpos = newpos + "px";
					$("#"+$(this).data( "staticmaster" )).css( "top", strpos );
				}
				else if( diff <= -(HourToPx/4.0) )
				{
					var newpos = staticobjectpos - (HourToPx/4.0);
					var strpos = newpos + "px";
					$("#"+$(this).data( "staticmaster" )).css( "top", strpos );
				}
			   }
			});
			/*
			$(".chipTask").draggable({
			   containment: "#"+colname,
			   start: function(event, ui) { $(this).css( "z-index", 10000 ); },
			   stop: function(event, ui) { $(this).css( "z-index", 1000 ); },
			   drag: function(event, ui) { }
			});*/
		}
	    }
	    
	    function drawGant(container)
	    {
		var dateshown = [ "2012-09-01" ];//, "2012-09-02", "2012-09-03", "2012-09-04" ];
		
                var mobj = container;
                var i = 0;
                var odata = {};

		var byDate = new Object();
		
		for( s=0; s<$.qsglobal.solution.length; s++ )
		{
			if( $.qsglobal.solution[s].startdate == $.qsglobal.solution[s].enddate )
			{
				if( byDate.hasOwnProperty( $.qsglobal.solution[s].startdate ) == false )
				{
					var thisdateworkers = new Object();
					byDate[ $.qsglobal.solution[s].startdate ] = thisdateworkers;
				}
				if( byDate[ $.qsglobal.solution[s].startdate ].hasOwnProperty( $.qsglobal.solution[s].workerid ) == false )
				{
					if( byDate[ $.qsglobal.solution[s].startdate ].hasOwnProperty( "workercount" ) )
						byDate[ $.qsglobal.solution[s].startdate ].workercount++;
					else
						byDate[ $.qsglobal.solution[s].startdate ].workercount = 1;
					byDate[ $.qsglobal.solution[s].startdate ][ $.qsglobal.solution[s].workerid ] = new Object();
					var thisworkersshift = new Array();
					var thisworkerstask = new Array();
					byDate[ $.qsglobal.solution[s].startdate ][ $.qsglobal.solution[s].workerid ].shifts = thisworkersshift;
					byDate[ $.qsglobal.solution[s].startdate ][ $.qsglobal.solution[s].workerid ].tasks = thisworkerstask;
				}
				if( $.qsglobal.solution[s].type == "0" )
					byDate[ $.qsglobal.solution[s].startdate ][ $.qsglobal.solution[s].workerid ].shifts.push( $.qsglobal.solution[s] );
				else
					byDate[ $.qsglobal.solution[s].startdate ][ $.qsglobal.solution[s].workerid ].tasks.push( $.qsglobal.solution[s] );
			}
		}
		
		for( var d=0; d<dateshown.length; d++ )
		{
			for( wk in byDate[ dateshown[d] ] )
			{
				for( sf in byDate[ dateshown[d] ][ wk ].shifts )
				{
					odata[i] = {id: -1, name: '', starttimel:'0:00', startimeu:'0:00',durationl:'0:00',durationu:'0:00', color:'#00f'};
					odata[i].starttimel = odata[i].starttimeu = byDate[ dateshown[d] ][ wk ].shifts[ sf ].starttime;
					var stime = byDate[ dateshown[d] ][ wk ].shifts[sf].starttime.split( ":" );
					var etime = byDate[ dateshown[d] ][ wk ].shifts[sf].endtime.split( ":" );
					var start = parseInt(stime[0]) + parseInt(stime[1])/60.0;
					var stop = parseInt(etime[0]) + parseInt(etime[1])/60.0;
					var len = stop - start;
					var durationhour = Math.floor( len );
					var durationmin = Math.floor((len-Math.floor( len ))*60);
					var duration = durationhour + ":" + durationmin;
					odata[i].durationl = odata[i].durationu = duration;
					odata[i].name = $.qsglobal.workers[wk].firstname + " " + $.qsglobal.workers[wk].lastname;
					odata[i].color = $.qsglobal.workers[wk].color;
					odata[i].id = wk;
					i++;
				}
/*				for( tk in byDate[ bd ][ wo ].tasks )
				{
					alert( "Task : " + byDate[ bd ][ wo ].tasks[ tk ].starttime + " : " + byDate[ bd ][ wo ].tasks[ tk ].endtime );
				}*/
			}
		}
/*
                $.each($.qsglobal.tasks, function(key,val) {
                    odata[i] = {id: -1, name: '', starttimel:'0:00', startimeu:'0:00',durationl:'0:00',durationu:'0:00', color:'#00f'};
                    odata[i].starttimel = odata[i].starttimeu = val.starttime;
                    odata[i].durationl = odata[i].durationu = val.duration;
                    odata[i].name = val.name;
                    odata[i].color = val.color;
                    odata[i].id = val.id;
                    i++;
                });*/
		
                var obj = $("<div id=\"taskgantt\"></div>").appendTo(container);
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
	    }
	    
	    function drawBar(container)
	    {
		container.empty();
		
                var bbar = $("<div id=\"taskbar\"></div>").appendTo(container);
                bbar.css('width',$(window).width()-options.loff-20);
                $("<span id=\"taskradioshow\"></span>").html(
                    "<input type=\"radio\" id=\"solutioncalendar\" checked=\"checked\" name=\"taskradioshow\"/><label for=\"solutioncalendar\">Calendar</label>"+
                    "<input type=\"radio\" id=\"solutiongant\" name=\"taskradioshow\"/><label for=\"solutiongant\">Gant</label>")
                    .css('float','left').buttonset().appendTo(bbar);
                
		$("#solutioncalendar").click( function(){
			$("#gridcontain").remove();
			//$("#minicalendar").remove();
			$("#taskgantt").remove();
			drawCalendar(container);
		});

		$("#solutiongant").click( function(){
			$("#gridcontain").remove();
			//$("#minicalendar").remove();
			$("#taskgantt").remove();
			drawGant(container);
		});
		
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
	    }
	    
            return this.each(function() {
		drawBar($(this));
		drawCalendar($(this));
            });
	}
    });
})(jQuery);

function getsolutionsdata(done) {
    $.qsglobal.solution = null;
    var solutioninfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getsolutions', solutioninfo, function(data) {
//    postjson("json/solutions.json", solutioninfo, function(data) {
        if(data != null)
            $.qsglobal.solution = data.slice();
    }, true, done);
}