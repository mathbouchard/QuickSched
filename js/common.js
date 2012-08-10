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
        ondone();
    });
}

function getalldata() {
    getworkersdata(showworkers);
    gettagsdata(showtags);
    getresourcesdata(showresources);
    gettasksdata(showtasks);
    getshiftsdata(showshifts);
}

function showworkers() { $( "#workers" ).workersScreen(); }
function showtags() { $( "#tags" ).tagsScreen(); }
function showresources() { $( "#resources" ).resourcesScreen(); }
function showtasks() { $( "#tasks" ).tasksScreen(); }
function showshifts() { $( "#shifts" ).shiftsScreen(); }

function resetalldata() {
    $.qsglobal.workers = null;
    $.qsglobal.tasks = null;
    $.qsglobal.shifts = null;
    $.qsglobal.resources = null;
    $.qsglobal.tags = null;
    $.qsglobal.solver = null;
    $.qsglobal.solution = null;
    $.qsglobal.settings = null;
    $( "#workers" ).empty();
    $( "#tasks" ).empty();
    $( "#shifts" ).empty();
    $( "#resources" ).empty();
    $( "#tags" ).empty();
    $( "#solver" ).empty();
    $( "#solution" ).empty();
    $( "#settings" ).empty();
}

/*
 * Map convention
 * 0: Worker-Task
 * 1: Worker-Shift
 * 2: Worker-Resource
 * 3: Worker-Tag
 * 4: Task-Resource
 * 5: Task-Tag
 * 6: Shift-Tag
 * 7: Resource-Tag
*/