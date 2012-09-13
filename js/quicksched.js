/*
 * QuickSchedule QuickSced Main JavaScript
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
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
    $.qsglobal.solution = null;
    $.qsglobal.settings = null;
    $.qsglobal.mapid = null;
    $.qsglobal.isfullscreen = false;
    $.qsglobal.dbaddr = "https://"+window.location.host+"/RestSchedWS/qsdata/"; 
    
    $.qsglobal.session_token = null;
    $.qsglobal.username = "";
    $.qsglobal.waitobj = "";
    
    $( "#fullscreen" ).hide();
    $( "#maintabs" ).tabs();
    $(window).resize(function() { myresize(); });
    myresize();
    $( "#login-form" ).loginScreen();
    $( "#register-form" ).registerScreen();
    $( "#dologin" ).button().click(function() { $( "#login-form" ).dialog( "open" ); });
    $( "#dologout" ).button().click(function() { logout(); });  
    initLogin();
    setTimeout(function() { myresize(); }, 100);
    //setTimeout(function() { createproblem(); }, 900);
});
