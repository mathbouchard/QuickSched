/*
 * Common JavaScript
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://skdit.com
 *
 */

var xmlDoc;

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        
    });
})(jQuery);

function postjson(inurl, indata, insuccess, isasync, ondone) {
    $.ajax({
        headers: { 
            Accept : "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        type: "POST",
        async: isasync,
        url: inurl,
        data: JSON.stringify(indata),
        success: insuccess,
        dataType: "json"
    }).done(function() {
        if(ondone != null) {
            ondone();
        }
    });
}

function myresize() {
    var newh = $(document).height()-$.qsglobal.toff;
    var neww = $(window).width()-$.qsglobal.loff;
    $( "#normalscreen" ).width(neww);
    $( "#normalscreen" ).height(newh);
    $( "#taskgantt" ).width(neww);
    $( "#taskgantt" ).height(newh-66);
    $( "#taskbar" ).width(neww-20);
    //if($.qsglobal[].)
}

/*function getalldata() {
    getworkersdata(showworkers);
    gettagsdata(showtags);
    getresourcesdata(showresources);
    gettasksdata(showtasks);
    getshiftsdata(showshifts);
    getsolutionsdata(showsolutions);
    getmapsdata();    
}

function showworkers() { $( "#workers" ).workersScreen({loff: 83, toff: 101}); }
function showtags() { $( "#tags" ).tagsScreen({loff: 83, toff: 101}); }
function showresources() { $( "#resources" ).resourcesScreen({loff: 83, toff: 101}); }
function showtasks() { $( "#tasks" ).tasksScreen({loff: 83, toff: 101}); }
function showshifts() { $( "#shifts" ).shiftsScreen({loff: 83, toff: 101}); }
function showsolutions() { $( "#solutions" ).shiftsScreen({loff: 83, toff: 101}); }*/

function getalldata() {
    getworkersdata(showworkers);
    gettagsdata();
    getresourcesdata();
    gettasksdata();
    getshiftsdata();
    getsolutionsdata();
    getmapsdata();    
}

function showworkers() { $( "#normalscreen" ).workersScreen({loff: $.qsglobal.loff, toff: $.qsglobal.toff}); }
function showtags() { $( "#normalscreen" ).tagsScreen({loff: $.qsglobal.loff, toff: $.qsglobal.toff}); }
function showresources() { $( "#normalscreen" ).resourcesScreen({loff: $.qsglobal.loff, toff: $.qsglobal.toff}); }
function showtasks() { $( "#normalscreen" ).tasksScreen({loff: $.qsglobal.loff, toff: $.qsglobal.toff}); }
function showshifts() { $( "#normalscreen" ).shiftsScreen({loff: $.qsglobal.loff, toff: $.qsglobal.toff}); }
function showsolutions() { $( "#normalscreen" ).solutionsScreen({loff: $.qsglobal.loff, toff: $.qsglobal.toff}); }


function resetalldata() {
    $.qsglobal.workers = null;
    $.qsglobal.tasks = null;
    $.qsglobal.shifts = null;
    $.qsglobal.resources = null;
    $.qsglobal.tags = null;
    $.qsglobal.maps = null;
    $.qsglobal.leaves = null;
    $.qsglobal.breaks = null;
    $.qsglobal.solver = null;
    $.qsglobal.solution = null;
    $.qsglobal.settings = null;
    $.qsglobal.currcoord = null;
    $.qsglobal.maploaded = false;
    $( "#workers" ).empty();
    $( "#tasks" ).empty();
    $( "#shifts" ).empty();
    $( "#resources" ).empty();
    $( "#tags" ).empty();
    $( "#solver" ).empty();
    $( "#solution" ).empty();
    $( "#settings" ).empty();
    $( "#fullscreen" ).empty();
    $( "#normalscreen" ).empty();
}

function getmapsdata(done) {
    $.qsglobal.tasks = null;
    var mapinfo = {token:$.qsglobal.session_token};
    postjson($.qsglobal.dbaddr+'getmaps', mapinfo, function(data) {
        if(data != null)
            $.qsglobal.maps = data.slice();
    }, true, done);
}

function setmap(pos, obj, local) {
    /*$( "#solver" ).addClass("map").gmap({
        latitude: -2.206,
        longitude: -79.897,
        maptype: 'TERRAIN',
        zoom: 8,
        controls: {
            panControl: true,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: false,
            scrollwheel: true,
            overviewMapControl: false
        }
    });*/
    /*
    $('#solver').gmap().bind('init', function() { 
        $('#solver').gmap('click',  function(result, item, index) {
            alert('click');
            //var lat = result.location[0].geo[0].latitude;
            //var lng = result.location[0].geo[0].longitude;
            //$('#solver').gmap('addMarker', { 'position': new google.maps.LatLng(lat, lng), 'bounds': true });
        });
    });*/
    if (!local) {
        showmap(pos);
    } else if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition ( 
            function(position) {
                showmap(position.coords.latitude+','+position.coords.longitude);
            }, 
            function(error) {
                showmap(pos);
            }
        );	
    } else {
        showmap(pos);
    }   
}

function showmap(pos) {
    if($.qsglobal.maploaded) {
        var latlngStr = pos.split(",",2);
        var lat = parseFloat(latlngStr[0]);
        var lng = parseFloat(latlngStr[1]);
        $('#locmap').gmap('option', 'center', new google.maps.LatLng(lat,lng));
        $('#locmap').dialog( "open" );
    } else {
        preparemap(pos);
        $.qsglobal.maploaded = true;
    }
}
function preparemap(pos) {
    $('#locmap').dialog({
        autoOpen: false,
	width: 950,
        height: 700,
	modal: true,
    }).dialog( "open" );
    $('#locmap').gmap({
        center: pos,
        zoom: 8,
    }).bind('init', function(evt, map) {
        $(map).click( function(event) {
            //$('#locmap').gmap('addMarker', { 'position': event.latLng, 'bounds': true } );
            $.qsglobal.currcoord.val(event.latLng.toUrlValue(6));
            $("#locmap").dialog("close");
            /*$('#solver').gmap('displayDirections', {
                    'origin': event.latLng,
                    'destination': 'Quebec City, Canada',
                    'travelMode': google.maps.DirectionsTravelMode.WALKING
                }, {
                    'panel': document.getElementById('panel')
                },
                function(result, status) {
                    if ( status === 'OK' ) {
                        var str = "";
                        $.each(result.routes[0].legs, function(key,val) {
                            str="dist:"+val.distance.text+" dur:"+val.duration.text+", ("+val.distance.value+", "+val.duration.value+"),";
                        });
                        alert(str);
                    }
                });*/
            /*var dirserv = new google.maps.DirectionsService();
            dirserv.route({
                    'origin': event.latLng,
                    'destination': 'Casablanca, Morocco',
                    'travelMode': google.maps.DirectionsTravelMode.DRIVING
                }, 
                function(result, status) {
                    if ( status === 'OK' ) {
                        var str = "";
                        $.each(result.routes[0].legs, function(key,val) {
                            str="dist:"+val.distance.text+" dur:"+val.duration.text+", ("+val.distance.value+", "+val.duration.value+"),";
                        });
                        alert(str);
                    }
                }
            );*/
        });
        
        
        //$('#solver').gmap('addMarker', { /*id:'m_1',*/ 'position': '42.345573,-71.098326', 'bounds': true } );
    });    
}

function createproblem(fname) {
    
    var fileName="mysol.xml";
    var nbPieces=0;
    
    $.get(
        fileName,
        {},
        onLoad
    );
}



function onLoad(xmlData, strStatus)
{
    var color=new Array();
    var numbertext=new Array();
    
    color[0]="2";
    color[1]="6";
    color[2]="a";
    color[3]="e";
    
    numbertext[0]="Zero";
    numbertext[1]="One";
    numbertext[2]="Two";
    numbertext[3]="Three";
    numbertext[4]="Four";
    numbertext[5]="Five";
    numbertext[6]="Six";
    numbertext[7]="Seven";
    numbertext[8]="Eight";
    numbertext[9]="Nine";
    
    var jData = $( xmlData );
    //alert("onLoad");
    
    var tid = 0;
    jData.find("activitytype").each(function() {
        var act = $(this);
        taskinfo = {};
        taskinfo.color = '#'+color[(Math.floor(act.attr('id')/16))%4]+color[(Math.floor(act.attr('id')/16))%4]
            +color[(Math.floor(act.attr('id')/4))%4]+color[(Math.floor(act.attr('id')/4))%4]
            +color[act.attr('id')%4]+color[act.attr('id')%4];
        taskinfo.name = "T-"+numbertext[(Math.floor(act.attr('id')/10))%10]+"-"+numbertext[act.attr('id')%10];
        taskinfo.description = "original id = "+act.attr('id');
        taskinfo.active="1";
        taskinfo.sunday = "1";taskinfo.monday = "1";taskinfo.tuesday = "1";taskinfo.wednesday = "1";taskinfo.thursday = "1";taskinfo.friday = "1";taskinfo.saturday = "1";
        taskinfo.type = "Medium";
        taskinfo.note = "";
        taskinfo.qty = 1;
        taskinfo.id = tid;
        taskinfo.active = "1";
        taskinfo.token = $.qsglobal.session_token;
        act.find("window").each(function() {
            taskinfo.minworkduration = formnumber(parseInt($(this).attr("min")));
            taskinfo.maxworkduration = formnumber(parseInt($(this).attr("max")));
        });
        
        var max = 0;
        var min = 1440*365;    
        act.find("step").each(function() {
            var demandinfo = {}
            demandinfo.starttime = formnumber(parseInt($(this).attr("begin")));
            demandinfo.duration = formnumber(parseInt($(this).attr("length")));
            demandinfo.quantity = 1;
            demandinfo.taskid = tid;
            demandinfo.timeneeded = demandinfo.duration;
            demandinfo.token = $.qsglobal.session_token;
            if(parseInt($(this).attr("begin")) < min) {
                min = parseInt($(this).attr("begin"));
            }
            if(parseInt($(this).attr("begin"))+parseInt($(this).attr("length")) > max) {
                max = parseInt($(this).attr("begin"))+parseInt($(this).attr("length"));
            }
            
            postjson($.qsglobal.dbaddr+'adddemands', demandinfo, function(data) {
                if(data.success == "true")
                {
                    demandinfo.id = data.id;
                    $.qsglobal.demands.push(demandinfo);
                } else {
                    alert("Demand Save failed: "+act.attr('id'));
                }
            }, false, null);
        });
        taskinfo.starttime = formnumber(min);
        taskinfo.duration = formnumber(max-min);
        postjson($.qsglobal.dbaddr+'addtasks', taskinfo, function(data) {
                if(data.success == "true")
                {
                    if(taskinfo.id != data.id)
                        alert('tid != id');
                    $.qsglobal.tasks.push(taskinfo);
                } else {
                    alert("Task Save failed: "+act.attr('id'));
                }
            }, false, null);
        tid++;
    });
    wid=0;
    jData.find("employee").each(function() {
        var workerinfo = {};
        var emp = $(this);
        workerinfo.color = '#'+color[(Math.floor(emp.attr('id')/16))%4]+color[(Math.floor(emp.attr('id')/16))%4]
            +color[(Math.floor(emp.attr('id')/4))%4]+color[(Math.floor(emp.attr('id')/4))%4]
            +color[emp.attr('id')%4]+color[emp.attr('id')%4];
        workerinfo.firstname = numbertext[(Math.floor(emp.attr('id')/10))%10];
        workerinfo.lastname = numbertext[emp.attr('id')%10];
        workerinfo.code = "W"+emp.attr('id');
        workerinfo.active = "1";
        workerinfo.id = wid;
        workerinfo.token = $.qsglobal.session_token;
        postjson($.qsglobal.dbaddr+'addworkers', workerinfo, function(data) {
            if(data.success == "true")
            {
                if(workerinfo.id != data.id)
                    alert('wid != id');
                $.qsglobal.workers.push(workerinfo);
            } else {
                alert("Worker Save failed: "+emp.attr('id'));
            }
        }, false, null);
        var max = 0;
        var min = 1440*365;
        var sbreaks = [];
        emp.find("piece").each(function() {
            if(parseInt($(this).attr("begin")) < min) {
                min = parseInt($(this).attr("begin"));
            }
            if(parseInt($(this).attr("begin"))+parseInt($(this).attr("length")) > max) {
                max = parseInt($(this).attr("begin"))+parseInt($(this).attr("length"));
            }
            sbreaks.push(parseInt($(this).attr("begin")));
            sbreaks.push((parseInt($(this).attr("begin"))+parseInt($(this).attr("length"))));
        });
        sbreaks.sort(function(a,b){return a-b});
        var shiftinfo = {};
        shiftinfo.name = "S-"+workerinfo.firstname+"-"+workerinfo.lastname;
        shiftinfo.description = "original id = "+emp.attr('id');
        shiftinfo.color = workerinfo.color;
        shiftinfo.starttimel = formnumber(min);
        shiftinfo.starttimeu = formnumber(min);
        shiftinfo.durationl = formnumber(max-min);
        shiftinfo.durationu = formnumber(max-min);
        shiftinfo.active="1";
        shiftinfo.id = wid;
        shiftinfo.sunday = "1";shiftinfo.monday = "1";shiftinfo.tuesday = "1";shiftinfo.wednesday = "1";shiftinfo.thursday = "1";shiftinfo.friday = "1";shiftinfo.saturday = "1";
        shiftinfo.token = $.qsglobal.session_token;
        postjson($.qsglobal.dbaddr+'addshifts', shiftinfo, function(data) {
            if(data.success == "true")
            {
                if(shiftinfo.id != data.id)
                    alert('wid != id');
                $.qsglobal.shifts.push(shiftinfo);
            } else {
                alert("Shift Save failed: "+emp.attr('id'));
            }
        }, false, null);
        
        for(i=1; i < sbreaks.length-1; i+=2) {
            var breakinfo = {};
            breakinfo.shiftid = shiftinfo.id;
            breakinfo.name = "break"+emp.attr('id');
            breakinfo.starttimel = formnumber(sbreaks[i]-min);
            breakinfo.starttimeu = formnumber(sbreaks[i]-min);
            breakinfo.duration = formnumber(sbreaks[i+1]-sbreaks[i]);
            breakinfo.minfromextremities = "0:00";
            breakinfo.minfrombreaks = "0:00";
            breakinfo.token = $.qsglobal.session_token;
            
            postjson($.qsglobal.dbaddr+'addbreaks', breakinfo, function(data) {
                if(data.success == "true")
                {
                    breakinfo.id = data.id;
                    $.qsglobal.breaks.push(breakinfo);
                } else {
                    alert("Save failed.")
                }
            }, false, null);
        }
                                
        var mapinfo = {}
        mapinfo.type = 1;
        mapinfo.id1 = workerinfo.id;
        mapinfo.id2 = shiftinfo.id;
        mapinfo.token = $.qsglobal.session_token;
        postjson($.qsglobal.dbaddr+'addmaps', mapinfo, function(data) {
            if(data.success == "true")
            {
                mapinfo.id = data.id;
                $.qsglobal.maps.push(mapinfo);
            } else {
                alert("Map Save failed: "+emp.attr('id'));
            }
        }, false, null);
        
        emp.find("qualifications").each(function() {
            var str = $(this).text().split(" ");
            for(j = 0; j < str.length; j++) {
                //alert("qualif "+str[j]);
                if(str[j]=="")
                    continue;
                    
                var mapinfo2 = {}
                mapinfo2.type = 0;
                mapinfo2.id1 = workerinfo.id;
                mapinfo2.id2 = parseInt(str[j]);
                mapinfo2.token = $.qsglobal.session_token;
                postjson($.qsglobal.dbaddr+'addmaps', mapinfo2, function(data) {
                    if(data.success == "true")
                    {
                        mapinfo2.id = data.id;
                        $.qsglobal.maps.push(mapinfo2);
                    } else {
                        alert("Map2 Save failed: "+emp.attr('id'));
                    }
                }, false, null);
            }
        });
        wid++;
    });
    swid=0;
    jData.find("employee").each(function() {
        var emp = $(this);
        var starttime = 365*24*60;
        var endtime = 0;
        $.qsglobal.solutions = [];
        emp.find("piece").each(function() {
            var piece = $(this);
            if(parseInt($(this).attr("begin")) < starttime)
                starttime = parseInt($(this).attr("begin"));
            if(parseInt($(this).attr("begin"))+parseInt($(this).attr("length")) > endtime)
                endtime = parseInt($(this).attr("begin"))+parseInt($(this).attr("length"));    
            piece.find("activity").each(function() {
                var solutioninfo = {};
                solutioninfo.solutiongroupid = 0;
                solutioninfo.workerid = swid;
                solutioninfo.assignid = parseInt($(this).attr("type"));
                solutioninfo.type = 1;
                solutioninfo.startdate = "2012-09-01";
                solutioninfo.starttime = formnumber(parseInt($(this).attr("begin")));
                solutioninfo.enddate = "2012-09-01";
                solutioninfo.endtime = formnumber(parseInt($(this).attr("begin"))+parseInt($(this).attr("length")));
                solutioninfo.assign = "1";
                solutioninfo.token = $.qsglobal.session_token;
                postjson($.qsglobal.dbaddr+'addsolutions', solutioninfo, function(data) {
                    if(data.success == "true")
                    {
                        $.qsglobal.solutions.push(solutioninfo);
                    } else {
                        alert("Solution Save failed: "+emp.attr('id'));
                    }
                }, false, null);
            });
        });
        var solutioninfo = {};
        solutioninfo.solutiongroupid = 0;
        solutioninfo.workerid = swid;
        solutioninfo.assignid = swid;
        solutioninfo.type = 0;
        solutioninfo.startdate = "2012-09-01";
        solutioninfo.starttime = formnumber(starttime);
        solutioninfo.enddate = "2012-09-01";
        solutioninfo.endtime = formnumber(endtime);
        solutioninfo.assign = "1";
        solutioninfo.token = $.qsglobal.session_token;
        postjson($.qsglobal.dbaddr+'addsolutions', solutioninfo, function(data) {
            if(data.success == "true")
            {
                $.qsglobal.solutions.push(solutioninfo);
            } else {
                alert("Solution Save failed: "+emp.attr('id'));
            }
        }, false, null);
        swid++;
    });
    /*$("#shifts").shiftsScreen({loff: 83, toff: 101});
    $("#tasks").tasksScreen({loff: 83, toff: 101});
    $("#workers").workersScreen({loff: 83, toff: 101});
    $("#solutions").solutionsScreen({loff: 83, toff: 101});*/
    showworkers();
}

function formnumber(val) {
    var temp = Math.floor(val/60);
    var ret = temp+":";
    temp = val%60;
    if(temp < 10) {
        ret = ret+"0"+temp;
    } else {
        ret = ret+temp;
    }
    return ret;
}

function savetodb(opts,o) {
    var info = {};
    var pre = o.prefix;
    for(i = 0; i < o.fields.length; i++) {
        if(o.fields[i].type=="weekdays") {
            info.weekdays = parseInt($("#"+pre+"sunday").val())*64+parseInt($("#"+pre+"monday").val())*32+parseInt($("#"+pre+"tuesday").val())*16
            +parseInt($("#"+pre+"wednesday").val())*8+parseInt($("#"+pre+"thursday").val())*4+parseInt($("#"+pre+"friday").val())*2+parseInt($("#"+pre+"saturday").val());
            /*info.sunday = $("#"+pre+"sunday").val(); info.monday = $("#"+pre+"monday").val(); info.tuesday = $("#"+pre+"tuesday").val();
            info.wednesday = $("#"+pre+"wednesday").val(); info.thursday = $("#"+pre+"thursday").val(); info.friday = $("#"+pre+"friday").val();
            info.saturday = $("#"+pre+"saturday").val();*/
        } else if (o.fields[i].itemname != null) {
            info[o.fields[i].itemname] = $("#"+pre+"input-"+i).val();
        }
    }
    for(i = 0; i < o.hiddenval.length; i++) {
        info[o.hiddenval[i].itemname] =  o.hiddenval[i].val;   
    }
    $.each(o.choiceval, function(key,val) {
        info[key] = val;   
    });
    info.token = $.qsglobal.session_token;
    info.id = "";
    if(o.ind==-1) {
        info.id = -1;
        postjson($.qsglobal.dbaddr+opts.jsonadd, info, function(data) {
            if(data.success == "true")
            {
                info.id = data.id;
                opts.globalobj.push(info);
                o.reload();
            } else {
                alert(o.tr("Failed to save"));
            }
        }, false, null);
    } else {
        info.id = o.item.id;
        postjson($.qsglobal.dbaddr+opts.jsonupdate, info, function(data) {
            if(data.success == "true")
            {
                info.id = o.item.id;
                opts.globalobj.splice(o.ind,1,info);
                o.reload();
            } else {
                alert(o.tr("Failed to save"));
            }
        }, false, null);
    }
}

/*
 * Map convention'
 * 0: Worker-Task
 * 1: Worker-Shift
 * 2: Worker-Resource
 * 3: Worker-Tag
 * 4: Task-Resource
 * 5: Task-Tag
 * 6: Shift-Tag
 * 7: Resource-Tag
*/