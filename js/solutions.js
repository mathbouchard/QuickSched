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
            return this.each(function() {
		var dateshown = [ "2012-09-01" ];//, "2012-09-02", "2012-09-03", "2012-09-04" ];
		
                var obj = $(this);
                obj.empty();
				
                var udiv = $('<div></div>').appendTo( $( this ) );
		udiv.attr( 'id', 'datepicker' );
		$("#datepicker").datepicker({
			onSelect: function(dateText, inst) { alert( dateText ); }
		}
		);
		//$(".ui-datepicker-calendar").css("background-color", '#95A0FF');
		$("#datepicker").dialog();
		$(".ui-datepicker-calendar").selectable();
		
		var gridcontain = $('<div id="gridcontain" class="mygrid"></div>').appendTo( $(this ) );
		
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
		
		for( bd in byDate )
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
		}
		
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
			
				for( sf in byDate[ dateshown[d] ][ wk ].shifts )
				{
					var stime = byDate[ dateshown[d] ][ wk ].shifts[sf].starttime.split( ":" );
					var etime = byDate[ dateshown[d] ][ wk ].shifts[sf].endtime.split( ":" );
					var start = 42*(stime[0]-1) + 42*stime[1]/60.0; // pour le moment 0 = 1am; 1hr = 42px
					var stop = 42*(etime[0]-1) + 42*etime[1]/60.0;
					var len = stop - start;
					var content = $('#gutter'+colid).html();
//											$('#gutter'+colid).html(content + '<div class="chip" style="top:'+start+'px;left:'+poscolpercent+'%;width:'+sizecolpercent+'%;"><dl class="cbrd" style="height:' + len + 'px;border-color:#7BD148;background-color:' + $.qsglobal.workers[wk].color + ';color:#777777;-webkit-margin-before:0px;-webkit-margin-after:0px"><dt style="background-color:;">5:30p – 8:30p <i class="cic cic-dm  cic-tmr" title="Reminders">&nbsp;</i></dt><dd><span class="evt-lk ca-elp204" style="cursor: pointer; ">(No title)</span></dd></dl></div>');
					$('#gutter'+colid).html(content + '<div class="chip" style="top:'+start+'px;left:'+poscolpercent+'%;width:'+sizecolpercent+'%;"><dl class="cbrd" style="height:' + len + 'px;border-color:#7BD148;background-color:' + $.qsglobal.workers[wk].color + ';color:#777777;-webkit-margin-before:0px;-webkit-margin-after:0px"></dl></div>');
				}
				poscolpercent += sizecolpercent;
			
			}
		
		}
            });
	}
    });
})(jQuery);

function getsolutionsdata(done) {
    $.qsglobal.solution = null;
    var solutioninfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getsolutions', solutioninfo, function(data) {
    //postjson("json/solutions.json", solutioninfo, function(data) {
        if(data != null)
            $.qsglobal.solution = data.slice();
    }, true, done);
}