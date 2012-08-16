/*
 * QuickSchedule Navigation JavaScript
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

function myresize() {
    var newh = $(document).height()-101;
    var neww = $(window).width()-83;
    $( "#workers" ).width(neww);
    $( "#workers" ).height(newh);
    $( "#tasks" ).width(neww);
    $( "#tasks" ).height(newh);
    $( "#shifts" ).width(neww);
    $( "#shifts" ).height(newh);
    $( "#resources" ).width(neww);
    $( "#resources" ).height(newh);
    $( "#tags" ).width(neww);
    $( "#tags" ).height(newh);
    $( "#solver" ).width(neww);
    $( "#solver" ).height(newh);
    $( "#solution" ).width(neww);
    $( "#solution" ).height(newh);
    $( "#settings" ).width(neww);
    $( "#settings" ).height(newh);
    $( "#taskgantt" ).width(neww);
    $( "#taskgantt" ).height(newh-66);
    $( "#taskbar" ).width(neww-20);
}