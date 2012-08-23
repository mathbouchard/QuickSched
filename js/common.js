/*
 * Common JavaScript
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

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

function getalldata() {
    getworkersdata(showworkers);
    gettagsdata(showtags);
    getresourcesdata(showresources);
    gettasksdata(showtasks);
    getshiftsdata(showshifts);
    getmapsdata(showshifts);
}

function showworkers() { $( "#workers" ).workersScreen({loff: 83, toff: 101}); }
function showtags() { $( "#tags" ).tagsScreen({loff: 83, toff: 101}); }
function showresources() { $( "#resources" ).resourcesScreen({loff: 83, toff: 101}); }
function showtasks() { $( "#tasks" ).tasksScreen({loff: 83, toff: 101}); }
function showshifts() { $( "#shifts" ).shiftsScreen({loff: 83, toff: 101}); }

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