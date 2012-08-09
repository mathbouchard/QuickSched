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
    $.qsglobal.solver = null;
    $.qsglobal.solution = null;
    $.qsglobal.settings = null;
    
    $.qsglobal.session_token = null
    $.qsglobal.username = "";
    $.qsglobal.waitobj = "";

    $( "#maintabs" ).tabs();
    $(window).resize(function() { myresize(); });
    myresize();
    $( "#login-form" ).loginScreen();
    $( "#register-form" ).registerScreen();
    $( "#dologin" ).button().click(function() { $( "#login-form" ).dialog( "open" ); });
    $( "#dologout" ).button().click(function() { logout(); });
    
    initLogin();
    setTimeout(function() { myresize();}, 100);
});