/*
 * QuickSchedule Login jQuery plugin
 *
 * Copyright 2012, Mathieu Bouchard
 * Licensed under the GPL Version 3 license.
 * http://q-opt.com
 *
 */

(function($){
    $.fn.extend({ 
        //plugin name - animatemenu
        loginScreen: function(opts) {
 
            //Settings list and the default values
            var defaults = {
                title: 'Login',
                background: '#eee'
            };
             
            var options = $.extend(defaults, opts);
         
            return this.each(function() {
                var o =options;
                var obj = $(this);
                
                //$(this).css('background', '#a0b4d2');
                   
                var type_log = $('<div id="type-login"><div>').appendTo( $( this ) );
                type_log.append($('<p class="validateTips">All form fields are required.</p>'));
                type_log.append($('<form</form>').html(
                    '<fieldset>'+
                    '<label for="lname">User name</label>'+
                    '<input type="text" name="name" id="lname" class="text ui-widget-content ui-corner-all" />'+
                    '<label for="lpassword">Password</label>'+
                    '<input type="password" name="password" id="lpassword" value="" class="text ui-widget-content ui-corner-all" />'+
                    '<a href="#" onclick="javascript:$(\'#register-form\').dialog( \'open\' );$(\'#login-form\').dialog(\'close\');">Not a member? Register</a>'+
                    '</fieldset>'));
                //$(\'#login-form\').dialog(\'close\');
                //$(\"#register-form\").dialog( \"open\" );
                var name = $( "#lname" ),
                    password = $( "#lpassword" ),
                    allFields = $( [] ).add( name ).add( password ),
                    tips = $( ".validateTips" );
                 
                obj.dialog({
		    autoOpen: false,
		    height: 360,
		    width: 450,
		    modal: true,
		    buttons: {
                        "Login": function() {
                            var bValid = true;
                            
                            allFields.removeClass( "ui-state-error" );
                            
                            var loginfo = {username:"", password:"", email:""};
                            loginfo.username = name.val();
                            loginfo.password = password.val();
                            
                            postjson($.qsglobal.dbaddr+'login', loginfo, function(data) {
                                if(data.success == "true")
                                {
                                    $.cookie("quicksched-lt", data.token, { expires: 1 });
                                    $.cookie("quicksched-un", loginfo.username, { expires: 1 });
                                    $.qsglobal.session_token = data.token;
                                    $.qsglobal.username = loginfo.username;
                                    $( "#usernametag" ).text($.qsglobal.username);
                                    $( "#loginzone" ).hide();
                                    $( "#userzone" ).show();
                                    getalldata();
                                } else {
                                    alert("Login failed.")
                                }
                            });
                            
                            $( this ).dialog( "close" );
                        },
                        Cancel: function() {
                            $( this ).dialog( "close" );
                        }
                    },
                    close: function() {
                        allFields.val( "" ).removeClass( "ui-state-error" );
                    }
		});
                 
            });
        },
        registerScreen: function(opts) {
 
            //Settings list and the default values
            var defaults = {
                title: 'Login',
                background: '#eee'
            };
             
            var options = $.extend(defaults, opts);
         
            return this.each(function() {
                var o =options;
                var obj = $(this);
                
                //$(this).css('background', '#a0b4d2');
                   
                var type_reg = $('<div id="type-register"><div>').appendTo( $( this ) );
                type_reg.append($('<p class="validateTips">All form fields are required.</p>'));
                type_reg.append($('<form</form>').html(
                    '<fieldset>'+
                    '<label for="rname">User name</label>'+
                    '<input type="text" name="name" id="rname" class="text ui-widget-content ui-corner-all" />'+
                    '<label for="remail">Email</label>'+
                    '<input type="text" name="email" id="remail" value="" class="text ui-widget-content ui-corner-all" />'+
                    '<label for="rpassword">Password</label>'+
                    '<input type="password" name="password" id="rpassword" value="" class="text ui-widget-content ui-corner-all" />'+
                    '<label for="rcpassword">Confirm password</label>'+
                    '<input type="password" name="cpassword" id="rcpassword" value="" class="text ui-widget-content ui-corner-all" />'+
                    '</fieldset>'));
        
                var name = $( "#rname" ),
                    email = $( "#remail" ),
                    password = $( "#rpassword" ),
                    cpassword = $( "#rcpassword" ),
                    allFields = $( [] ).add( name ).add( email ).add( password ).add( cpassword ),
                    tips = $( ".validateTips" );
                 
                obj.dialog({
		    autoOpen: false,
		    height: 470,
		    width: 450,
		    modal: true,
		    buttons: {
                        "Register": function() {
                            var bValid = true;
                            
                            allFields.removeClass( "ui-state-error" );

                            bValid = bValid && checkLength( name, "username", 3, 16 );
                            bValid = bValid && checkLength( email, "email", 6, 80 );
                            bValid = bValid && checkLength( password, "password", 5, 16 );

                            bValid = bValid && checkRegexp( name, tips, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
                            // From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                            bValid = bValid && checkRegexp( email, tips, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
                            bValid = bValid && checkRegexp( password, tips, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
                            bValid = bValid && checkPassword(password, cpassword);
                            
                            if(bValid) {
                                var loginfo = {username:"", password:"", email:""};
                                loginfo.username = name.val();
                                loginfo.password = password.val();
                                loginfo.email = email.val();
                            
                                postjson($.qsglobal.dbaddr+'register', loginfo, function(data) {
                                    if(data.success == "true") {
                                        $.cookie("quicksched-lt", data.token, { expires: 1 });
                                        $.cookie("quicksched-un", loginfo.username, { expires: 1 });
                                        $.qsglobal.session_token = data.token;
                                        $.qsglobal.username = loginfo.username;
                                        $( "#usernametag" ).text($.qsglobal.username);
                                        $( "#loginzone" ).hide();
                                        $( "#userzone" ).show();
                                        getalldata();
                                    } else {
                                        alert("A problem occured during the registration process, please retry.")
                                    }
                                });
                            }

                            if ( bValid ) {
                                $( this ).dialog( "close" );
                            }
                        },
                        Cancel: function() {
                            $( this ).dialog( "close" );
                        }
                    },
                    close: function() {
                        allFields.val( "" ).removeClass( "ui-state-error" );    
                    }
		});
                 
            });
        }
    });
})(jQuery);

function initLogin() {
    $.qsglobal.session_token = $.cookie("quicksched-lt");
    if($.qsglobal.session_token != null) {
        $.qsglobal.username = $.cookie("quicksched-un");
        $( "#usernametag" ).text($.qsglobal.username);
        $( "#loginzone" ).hide();
        $( "#userzone" ).show();
        getalldata();
    } else {
        $.qsglobal.session_token = "pcz6AJpxbT8gRB3B1P5WFw==";
        $.qsglobal.username = "default";
        $( "#usernametag" ).text($.qsglobal.username);
        $( "#loginzone" ).hide();
        $( "#userzone" ).show();
        getalldata();
    }
    /*else
    {
        $( "#userzone" ).hide();
        $( "#loginzone" ).show();
    }*/
}

function logout() {
    $.cookie("quicksched-lt", null);
    $.cookie("quicksched-un", null);
    $( "#usernametag" ).val("");
    $( "#userzone" ).hide();
    $( "#loginzone" ).show();
    resetalldata();
}

function updateTips( t, to ) {
    to.text( t ).addClass( "ui-state-highlight" );
    setTimeout(function() {
        to.removeClass( "ui-state-highlight", 1500 );
    }, 500 );
}

function checkLength( o, n, min, max ) {
    if ( o.val().length > max || o.val().length < min ) {
        o.addClass( "ui-state-error" );
        updateTips( "Length of " + n + " must be between " +
                min + " and " + max + "." );
        return false;
    } else {
        return true;
    }
}

function checkPassword( o1, o2) {
    if ( o1.val() != o2.val() ) {
        //o1.addClass( "ui-state-error" );
        //o2.addClass( "ui-state-error" )
        updateTips( "Password confirm do not match.");
        return false;
    } else {
        return true;
    }
}

function checkRegexp( o, to, regexp, n ) {
    if ( !( regexp.test( o.val() ) ) ) {
        o.addClass( "ui-state-error" );
        updateTips( n, to );
        return false;
    } else {
        return true;
    }
}