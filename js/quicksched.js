/*
 * QuickSchedule QuickSced Main JavaScript
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://skdit.com
 *
 */

jQuery(document).ready(function() {
    $.qsglobal = {};
    $.qsglobal.workers = null;
    $.qsglobal.tasks = null;
    $.qsglobal.shifts = null;
    $.qsglobal.resources = null;
    $.qsglobal.tags = null;
    $.qsglobal.maps = null;
    $.qsglobal.breaks = null;
    $.qsglobal.leaves = null;
    $.qsglobal.demands = null;
    $.qsglobal.solver = null;
    $.qsglobal.solutions = null;
    $.qsglobal.settings = null;
    $.qsglobal.mapid = null;
    $.qsglobal.isfullscreen = false;
    $.qsglobal.lang = {};
    
    $.qsglobal.currlang = $.cookie("quicksched-cl");
    if($.qsglobal.currlang == null) {
        $.qsglobal.currlang = 0;
    }
    $( "#langselected" ).val($.qsglobal.currlang);
    definelanguages();
    setlanguages();
    $.qsglobal.dbaddr = "https://"+window.location.host+"/RestSchedWS/qsdata/";
    $("#langselected").change(function() {
        $.qsglobal.currlang = $( "#langselected" ).val();
        $.cookie("quicksched-cl", $.qsglobal.currlang, { expires: 1 });
        setlanguages();
    });
    
    $.qsglobal.loff = 83;
    $.qsglobal.toff = 101;
    
    $.qsglobal.session_token = null;
    $.qsglobal.username = "";
    $.qsglobal.waitobj = "";
    
    $( "#fullscreen" ).hide();
    $( "#maintabs" ).tabs({
        select: function(event, ui) {
            //alert(ui.index);
            if(ui.index == 0) {
                showworkers();                
            } else if(ui.index == 1) {
                showtasks();    
            } else if(ui.index == 2) {
                showshifts();    
            } else if(ui.index == 3) {
                showresources();    
            } else if(ui.index == 4) {
                showtags();    
            } else if(ui.index == 5) {
                showtags();    
            } else if(ui.index == 6) {
                showsolutions();    
            }            
        },
        option: {
            selected: 0
        }
    });
    //$( "#maintabs" ).tabs( "option", "selected", 3 );
    $(window).resize(function() { myresize(); });
    myresize();
    $( "#login-form" ).loginScreen();
    $( "#register-form" ).registerScreen();
    $( "#dologin" ).button().click(function() { $( "#login-form" ).dialog( "open" ); });
    $( "#dologout" ).button().click(function() { logout(); });  
    initLogin();
    setTimeout(function() { myresize(); }, 100);
    //setTimeout(function() { createproblem(); }, 3000);
});
